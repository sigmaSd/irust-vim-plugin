import { Denops } from "https://deno.land/x/denops_std/mod.ts";
import * as fn from "https://deno.land/x/denops_std/function/mod.ts";
import { execute } from "https://deno.land/x/denops_std/helper/mod.ts";

export async function main(denops: Denops): Promise<void> {
  let port = 9000;
  let irust = "irust";

  denops.dispatcher = {
    async startIRust(args: unknown): Promise<void> {
      const [userPort, userIrust] = (args as string).split(" ");
      if (userPort) {
        port = parseInt(userPort);
      }
      if (userIrust) {
        irust = userIrust;
      }

      const lines = await denops.eval("&lines") as number;
      // Start the repl
      await denops.cmd(
        `:bel split term://${irust}`,
      );
      // Resize the repl window
      await denops.cmd(`resize ${lines / 4}`);
      // Scroll to bottom (TODO)
      // Restore focus to the original split
      await denops.cmd("wincmd w");
    },
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
    // deno-lint-ignore require-await
    async reset(): Promise<void> {
      send(":reset", port);
    },
    async syncToCursor(): Promise<void> {
      const currentLine = await fn.line(denops, ".");
      const currentFilePath = await denops.eval('expand("%:p")') as string;

      send(`:hard_load ${currentFilePath} ${currentLine - 1}`, port);
    },
    async syncCrateToCursor(): Promise<void> {
      const currentLine = await fn.line(denops, ".");
      const currentFilePath = await denops.eval('expand("%:p")') as string;

      send(`:hard_load_crate ${currentFilePath} ${currentLine - 1}`, port);
    },
  };

  await execute(
    denops,
    `
    command! -nargs=* IRust call denops#request('${denops.name}', 'startIRust', [<q-args>])
    command! -range IRustSendSelection call denops#request('${denops.name}', 'sendSelection','')
    command! IRustSendCurrentWord call denops#request('${denops.name}', 'sendCurrentWord','')
    command! IRustSendCurrentLine call denops#request('${denops.name}', 'sendCurrentLine','')
    command! IRustReset call denops#request('${denops.name}', 'reset','')
    command! IRustSyncToCursor call denops#request('${denops.name}', 'syncToCursor','')
    command! IRustSyncCrateToCursor call denops#request('${denops.name}', 'syncCrateToCursor','')
    `,
  );
}

async function send(lines: string, port: number): Promise<void> {
  try {
    const con = await Deno.connect({
      hostname: "127.0.0.1",
      port,
    });
    await con.write(new TextEncoder().encode(lines));
    con.close();
  } catch {
    console.log(
      "Failed to send input to IRust, make sure its running and that the port is correct.",
    );
    return;
  }
}
