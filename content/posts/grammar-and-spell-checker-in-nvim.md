---
title: "Grammar and Spell Checker in Neovim with LTeX Language Server"
description:
  "Grammar and spell checker in Neovim with LTeX Language Server to check for grammar
  and spelling issues in LaTeX, Markdown, reStructuredText, and others."
date: 2023-02-11T15:34:16-05:00
---

[LTeX Language Server](https://github.com/valentjn/ltex-ls) is an LSP for
[LanguageTool](https://languagetool.org/) that can be embedded into Nvim LSP protocol to
provide real time grammar and spell checking for most commonly used text formats such as
Markdown, LaTeX, and reStructuredText. In this guide, I will show how to add LTeX
Language Server to an existing LSP setup with nvim-lspconfig and Mason, and how to add a
custom dictionary for words that are not recognized by the LanguageTool proofreading
service.

## Custom Dictionary Using Built-in Vim Spell Checker

Vim and Neovim come with a built-in spell checker tool
[spell](https://vimdoc.sourceforge.net/htmldoc/spell.html) that can generate a spell
file, which we can use to give LTeX Language Server an additional dictionary.

First, we define the spell file location as follows:

```lua
vim.opt.spellfile = vim.fn.stdpath("config") .. "/spell/en.utf-8.add"
```

This will tell Neovim the location of the spell file dictionary at
`~/.config/nvim/spell/en.utf-8.add`. We need to make sure this file exists in our
system. We can create it by doing the following:

```bash
mkdir -p ~/.config/nvim/spell
touch ~/.config/nvim/spell/en.utf-8.add
```

To add words to this dictionary in Neovim you can add the word under the cursor by
typing _zg_.

## Adding the Custom Dictionary to LTeX Language Server

Next, we create a Lua function that loops all the words in the spell file and creates a
table of words from it.

```lua
local words = {}
for word in io.open(vim.fn.stdpath("config") .. "/spell/en.utf-8.add", "r"):lines() do
	table.insert(words, word)
end
```

Finally, in order to have LTeX Language Server use this words table as an additional
dictionary we configure the following in the LTeX Language Server settings. This assumes
you already have LTeX Language Server installed and configured in Neovim:

```lua
--
-- ...
--
settings = {
    ltex = {
        dictionary = {
            ["en-US"] = words,
        },
    },
},
--
-- ...
--
```

## Conclusion

It is very straightforward to add a custom dictionary to LTeX Language Server in Neovim.
This guide did not cover all the initial setup for getting an LSP up and running in
Neovim, but if you need a reference for that you can check my Neovim configuration on
[GitHub](https://github.com/miikanissi/dotfiles/blob/master/.config/nvim/init.lua). You
can also reach out to me via email at
[miika@miikanissi.com](mailto:miika@miikanissi.com).
