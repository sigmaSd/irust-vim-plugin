import { Denops } from "https://deno.land/x/denops_std@v3.0.0/mod.ts";
import * as fn from "https://deno.land/x/denops_std/function/mod.ts";

export async function main(denops: Denops): Promise<void> {
  let port = 9000;
  denops.dispatcher = {
    async sendCurrentLine(): Promise<void> {
      const currentLine = await fn.getline(denops, ".");
      send(currentLine.trim(), port);
    },
    async sendCurrentWord(): Promise<void> {
      const wordUnderCursor = await denops.eval('expand("<cword>")') as string;
      send(wordUnderCursor, port);
    },
    async sendSelection(): Promise<void> {
      const [_bufN, lineStart] = await fn.getpos(denops, "'<");
      const [_bufN2, lineEnd] = await fn.getpos(denops, "'>");
      const lines = (await fn.getline(denops, lineStart, lineEnd)).join("\n")
        .trim();
      send(lines, port);
    },
    async startIRust(userPort: unknown): Promise<void> {
      if (userPort) {
        if (!isNumeric(userPort)) {
          throw "Port must be a number";
        }
        port = parseInt(userPort as string);
      }

      const lines = await denops.eval("&lines") as number;
      // Start the repl
      await denops.cmd(
        ":bel split term://irust",
      );
      // Resize the repl window
      await denops.cmd(`resize ${lines / 4}`);
      // Scroll to bottom (TODO)
      // Restore focus to the original split
      await denops.cmd("wincmd w");
    },
  };

  await denops.cmd(
    `command! -nargs=? IRust call denops#request('${denops.name}', 'startIRust', [<q-args>])`,
  );
  await denops.cmd(
    `command! -range IRustSendSelection call denops#request('${denops.name}', 'sendSelection','')`,
  );
  await denops.cmd(
    `command! IRustSendCurrentWord call denops#request('${denops.name}', 'sendCurrentWord','')`,
  );
  await denops.cmd(
    `command! IRustSendCurrentLine call denops#request('${denops.name}', 'sendCurrentLine','')`,
  );
}

async function send(lines: string, port: number): Promise<void> {
  const con = await Deno.connect({
    hostname: "127.0.0.1",
    port,
  });
  await con.write(new TextEncoder().encode(lines));
  con.close();
}

function isNumeric(str: unknown) {
  return !isNaN(str as number) &&
    !isNaN(parseFloat(str as string));
}
