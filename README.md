# irust-vim-plugin
IRust vim plugin using deno

## Instalation
```vim
Plug 'vim-denops/denops.vim' "Allows using plugins written with deno
Plug 'sigmaSd/irust-vim-plugin' "This actual plugin
```

# Usage
- Open a rust file
- Run `:IRust` to start the repl

Now you can send input to the repl using different methods:
- `:IRustSendCurrentWord` sends the word under the cursor
- `:IRustSendCurrentLine` sends the current line
- `:IRustSendSelection` sends the selected text

**Bindings example:**
```vim
nnoremap <space>ii :IRust<CR>
nnoremap <space>iw :IRustSendCurrentWord<CR>
nnoremap <space>il :IRustSendCurrentLine<CR>
vnoremap <space>is :IRustSendSelection<CR>
```
