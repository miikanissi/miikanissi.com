---
title: "Fast Fuzzy Finder for Vim With Fzf and Ripgrep"
date: 2022-04-19T20:29:54-04:00
description:
  "Using fzf and ripgrep with vim for fast fuzzy finding of files and file contents with
  syntax highlighting."
---

[Fzf](https://github.com/junegunn/fzf) is a lightning fast command-line fuzzy finder
that runs asynchronously and can be integrated in Vim to search for files, file
contents, and much more. In order to get the most out of the fuzzy finding capabilities
of fzf, we will be pairing it with [ripgrep](https://github.com/BurntSushi/ripgrep) and
[bat](https://github.com/sharkdp/bat). This will improve the search results and add a
nice syntax highlighted preview window. With the power of fzf and ripgrep we can
efficiently jump from file to file and improve our workflow.

## Setting up Fzf in Vim

fzf has an official Vim plugin that can be installed with any Vim plugin manager. We can
install fzf with [vim-plug](https://github.com/junegunn/vim-plug) by adding this to our
`.vimrc` and by running `:PlugInstall`:

```viml
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'
```

### Useful Fzf Commands That Work Out of the Box

| Command          | List                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `:Files [PATH]`  | Files (runs `$FZF_DEFAULT_COMMAND` if defined)                                                              |
| `:GFiles [OPTS]` | Git files (`git ls-files`)                                                                                  |
| `:Buffers`       | Open buffers                                                                                                |
| `:Rg [PATTERN]`  | [rg](https://github.com/BurntSushi/ripgrep) search results (`ALT-A` to select all, `ALT-D` to deselect all) |
| `:Tags [QUERY]`  | Tags in the project (`ctags -R`)                                                                            |
| `:Marks`         | Marks                                                                                                       |
| `:Windows`       | Windows                                                                                                     |
| `:Snippets`      | Snippets ([UltiSnips](https://github.com/SirVer/ultisnips))                                                 |

## Integrating Ripgrep With Fzf

By default fzf uses the `find` command to walk through a file hierarchy to locate files
based on a search criteria. However, fzf supports other similar search tools such as
[fd](https://github.com/sharkdp/fd), [ripgrep](https://github.com/BurntSushi/ripgrep),
or [the silver searcher](https://github.com/ggreer/the_silver_searcher) for creating a
list of files to traverse through. My preferred search tool to use is ripgrep. ripgrep
is a fast line-oriented search tool that recursively searches the current directory for
a regex pattern. ripgrep also automatically respects rules defined in `.gitignore`,
`.ignore`, and `.rgignore` for cleaner search results.

We can override the default fzf find command by defining `FZF_DEFAULT_COMMAND` in our
environment. The easiest way to do this is by setting it in our `.bashrc`:

```bash
export FZF_DEFAULT_COMMAND='rg --files --ignore-vcs --hidden'
```

This command passes three options to ripgrep to make ripgrep print the output of files,
including hidden files while respecting rules set in `.gitignore`.

Now if we call `:Files` in Vim we should see a list of files based on the search results
from `rg --files --ignore-vcs --hidden`.

We can also use ripgrep to interactively search for file contents. fzf supports this
behaviour out of the box with the command `:Rg`.

## Fzf File Previews Inside Vim

It is very helpful to have file previews enabled in order to find the right file with
fzf. This can be achieved by redefining the default fzf commands in our `.vimrc`:

```viml
command! -bang -nargs=? -complete=dir Files
    \ call fzf#vim#files(<q-args>, fzf#vim#with_preview(), <bang>0)
command! -bang -nargs=? -complete=dir GFiles
    \ call fzf#vim#gitfiles(<q-args>, fzf#vim#with_preview(), <bang>0)
command! -bang -nargs=* Rg
    \ call fzf#vim#grep(
    \   'rg --column --line-number --no-heading --color=always --smart-case -- '.shellescape(<q-args>), 1,
    \   fzf#vim#with_preview(), <bang>0)
```

Now if we call `:Files`, `:GFiles`, or `:Rg` in vim and make our search, we can see file
previews.

### Syntax Highlighting

By default fzf uses the `cat` command to show the file previews, but if we are mostly
working on code, we might want to also see some syntax highlighting in our file
previews. Luckily fzf supports this out of the box with an external program
[bat](https://github.com/sharkdp/bat). All we need to do is to install it and fzf will
automatically use it.

## Afterword

Overall fzf has great performance and it has improved my programming workflow,
especially when working with big projects. If you are interested in checking out my
complete Vim configuration, go to
[https://github.com/miikanissi/dotfiles](https://github.com/miikanissi/dotfiles).
