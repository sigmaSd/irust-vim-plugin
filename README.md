# irust-vim-plugin
IRust vim plugin using deno

## Instalation
Make sure `deno` is installed and then append these lines to vim configuration file (or your plugin magnager equivalent):

```vim
Plug 'vim-denops/denops.vim' "Allows using plugins written with deno
Plug 'sigmaSd/irust-vim-plugin' "This actual plugin
```

# Usage
- Make sure that `local_sever` is set to `true` in IRust configuration file
- Open a rust file
- Run `:IRust` to start the repl

Now you can send input to the repl using different methods:
- `:IRustSendCurrentWord` sends the word under the cursor
- `:IRustSendCurrentLine` sends the current line
- `:IRustSendSelection` sends the selected text

There are also commands to sync the current file to the repl
- `:IRustSyncToCursor` copies the whole file to IRust buffer, and sets its internal cursor to the current line (so variables in scope can be accessed)
- `:IRustSyncCrateToCursor` copies the whole src directory and toml file to IRust, this is the same as `IRustSyncToCursor` but more powerful since it allows using files that have internal or external imports

Couple of caveat of sync:
- Should be only used with `main.rs` file
- The file should be already formatted with `cargo fmt` before using sync
- `IRustSyncCrateToCursor` assumes a particular layout of the crate, it should at least have `$crate/src/main.rs` as an entry point
- more..

**Bindings example:**
```vim
nnoremap <space>ii :IRust<CR>
nnoremap <space>ir :IRustReset<CR>
nnoremap <space>iw :IRustSendCurrentWord<CR>
nnoremap <space>il :IRustSendCurrentLine<CR>
nnoremap <space>ic :IRustSyncToCursor<CR>
nnoremap <space>ick :IRustSyncCrateToCursor<CR>
vnoremap <space>is :IRustSendSelection<CR>
```

**Demo:**
<img src="https://github.com/sigmaSd/sigmaSd.github.io/raw/master/content/irust_book/assets/vim_plugin.gif"/>
