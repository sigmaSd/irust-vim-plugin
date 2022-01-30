# irust-vim-plugin
IRust vim plugin using deno

## Instalation
Make sure `deno` is installed and then append these lines to vim configuration file:

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
- `:IRustSyncToCursor` copies the whole file to IRust buffer, and sets the cursor to the current line

**Bindings example:**
```vim
nnoremap <space>ii :IRust<CR>
nnoremap <space>ir :IRustReset<CR>
nnoremap <space>iw :IRustSendCurrentWord<CR>
nnoremap <space>il :IRustSendCurrentLine<CR>
nnoremap <space>ic :IRustSyncToCursor<CR>
vnoremap <space>is :IRustSendSelection<CR>
```

**Demo:**
<img src="https://github.com/sigmaSd/sigmaSd.github.io/raw/master/content/irust_book/assets/vim_plugin.gif"/>
