---
title: "How to Setup Native Nvim LSP for Code Analysis, Autocompletion and Linting"
date: 2022-07-15T17:50:01-04:00
description:
  "Guide on how to setup LSP on nvim for code analysis, autocompletion, and automatic
  code linting and fixing."
---

Neovim or nvim has come a long way to overtake vim with support of multitude of new
features natively out of the box. One of these features is the support for the Language
Server Protocol (LSP), which means it acts as a client to LSP servers. In order to take
advantage of this feature there are a couple of important plugins that do the heavy
lifting of getting a working LSP server and client communication set up. In this post I
will go over what you need to get started on how to setup nvim LSP client for analysing
code, autocompletion and even automatic code linting and fixing.

## Installing the nvim plugins with Packer

To get started we first need to install the plugins. My preferred nvim plugin manager is
[Packer](https://github.com/wbthomason/packer.nvim) but this step can be done with any
other plugin manager as well. Please note I am configuring nvim in an `init.lua` file.
To learn more about how to configure nvim in lua you may refer to
[this helpful guide](https://github.com/nanotee/nvim-lua-guide).

```lua
require('packer').startup(function(use)
    use 'williamboman/nvim-lsp-installer' -- Automatically install LSPs
    use 'neovim/nvim-lspconfig' -- Collection of configurations for built-in LSP client
    use 'jose-elias-alvarez/null-ls.nvim' -- Null ls is used for code formatting and pylint analysis
    use 'hrsh7th/nvim-cmp' -- Autocompletion plugin
    use 'hrsh7th/cmp-nvim-lsp' -- Autocompletion with LSPs
end)
```

After saving the `init.lua` we can run `:PackerSync` to install the declared packages.

## Installing LSP Servers

In order to install the LSP servers used by the nvim LSP client we use a helpful plugin
called [nvim-lsp-installer](https://github.com/williamboman/nvim-lsp-installer). It is
not necessary to use this plugin as each LSP server can be installed manually, but I
like to use this plugin for convenience.

Below is a snippet of my setup for nvim-lsp-installer. For a full list of supported LSPs
refer to
[this manual](https://github.com/williamboman/nvim-lsp-installer#available-lsps=).

```lua
require("nvim-lsp-installer").setup({
    -- List of servers to automatically install
    ensure_installed = { 'pyright', 'tsserver', 'eslint', 'bashls', 'cssls', 'html', 'sumneko_lua', 'jsonls', 'clangd', 'lemminx' },
    -- automatically detect which servers to install (based on which servers are set up via lspconfig)
    automatic_installation = true,
    ui = {
        icons = {
            server_installed = "✓",
            server_pending = "➜",
            server_uninstalled = "✗"
        }
    }
})
```

## Enabling LSPs in nvim

Now that we have installed the required plugins and LSP servers we have to enable them.
For this we are using [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig). The
easiest way to setup a language server (pyright in this example) is by adding
`require'lspconfig'.pyright.setup{}` in the configuration file. However, nvim-lspconfig
does not automatically setup any keybindings or autocompletion. These can be setup in
the `on_attach` and `capabilities` functions respectively. In the snippet below I am
creating a local function for `on_attach` and `capabilities` which can be reused for
each language server configuration. In the `on_attach` function I am setting up keybinds
which will be enabled whenever nvim detects a filetype with an active LSP server. For
the `capabilities` function I am calling the plugin
[cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp), which provides autocompletion.

```lua
local lspconfig = require 'lspconfig'

-- Common LSP On Attach function
local on_attach = function(_, bufnr)
    local opts = { buffer = bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, opts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, opts)
    vim.keymap.set('n', '<leader>sh', vim.lsp.buf.signature_help, opts)
    vim.keymap.set('n', '<leader>wa', vim.lsp.buf.add_workspace_folder, opts)
    vim.keymap.set('n', '<leader>wr', vim.lsp.buf.remove_workspace_folder, opts)
    vim.keymap.set('n', '<leader>wl', function()
        vim.inspect(vim.lsp.buf.list_workspace_folders())
    end, opts)
    vim.keymap.set('n', '<leader>D', vim.lsp.buf.type_definition, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
    vim.keymap.set('n', 'gr', vim.lsp.buf.references, opts)
    vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, opts)
    vim.keymap.set('n', '<leader>so', require('telescope.builtin').lsp_document_symbols, opts)
end

-- nvim-cmp supports additional completion capabilities
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities = require('cmp_nvim_lsp').update_capabilities(capabilities)
```

Now in order to overried the default `on_attach` and `capabilities` functions for each
LSP server we can add the following snippet in the configuration, which will loop
through all the defined LSP servers and enable them using our local override functions:

```lua
-- LSPs with default setup: bashls (Bash), cssls (CSS), html (HTML), clangd (C/C++), jsonls (JSON)
for _, lsp in ipairs { 'bashls', 'cssls', 'html', 'clangd', 'jsonls'} do
    lspconfig[lsp].setup {
        on_attach = on_attach,
        capabilities = capabilities,
    }
end
```

### Additional keybindings for autocompletion

The following snippet adds custom keybindings for autocompletion:

```lua
-- nvim-cmp setup
local cmp = require 'cmp'
cmp.setup {
    snippet = {
        expand = function(args)
            luasnip.lsp_expand(args.body)
        end,
    },
    mapping = cmp.mapping.preset.insert({
        ['<C-d>'] = cmp.mapping.scroll_docs(-4),
        ['<C-f>'] = cmp.mapping.scroll_docs(4),
        ['<C-Space>'] = cmp.mapping.complete(),
        ['<CR>'] = cmp.mapping.confirm {
            behavior = cmp.ConfirmBehavior.Replace,
            select = true,
        },
        ['<Tab>'] = cmp.mapping(function(fallback)
            if cmp.visible() then
                cmp.select_next_item()
            elseif luasnip.expand_or_jumpable() then
                luasnip.expand_or_jump()
            else
                fallback()
            end
        end, { 'i', 's' }),
        ['<S-Tab>'] = cmp.mapping(function(fallback)
            if cmp.visible() then
                cmp.select_prev_item()
            elseif luasnip.jumpable(-1) then
                luasnip.jump(-1)
            else
                fallback()
            end
        end, { 'i', 's' }),
    }),
    sources = {
        { name = 'nvim_lsp' },
        { name = 'luasnip' },
    },
}
```

## Automatic code linting and fixing on save using null-ls

So far we have installed all the necessary plugins and enabled LSP servers with custom
keybindings and autocompletion. Now we can use a plugin called
[null-ls](https://github.com/jose-elias-alvarez/null-ls.nvim) to automatically use any
available linters on a file to fix code formatting on file save.

```lua
-- Null ls for automatic formatting and additional analysis
local augroup = vim.api.nvim_create_augroup("LspFormatting", {})
require("null-ls").setup({
    -- you can reuse a shared lspconfig on_attach callback here
    on_attach = function(client, bufnr)
        if client.supports_method("textDocument/formatting") then
            vim.api.nvim_clear_autocmds({ group = augroup, buffer = bufnr })
            vim.api.nvim_create_autocmd("BufWritePre", {
                group = augroup,
                buffer = bufnr,
                callback = function()
                    -- on 0.8, you should use vim.lsp.buf.format({ bufnr = bufnr }) instead
                    vim.lsp.buf.formatting_sync()
                end,
            })
        end
    end,
    sources = {
        require("null-ls").builtins.formatting.prettier.with({
            extra_filetypes = { "xml" }
        }),
        require("null-ls").builtins.formatting.black,
        require("null-ls").builtins.formatting.isort,
        require("null-ls").builtins.diagnostics.pylint.with({
            extra_args = { "--load-plugins=pylint_odoo", "-e", "odoolint" } -- Load pylint_odoo plugin for pylint
        }),
    },
})
-- Manually format buffer
vim.keymap.set('n', '<leader>bf', vim.lsp.buf.formatting, {})
```

## Afterword

Setting up nvim LSP client to work with different LSP servers can seem a bit
intimidating as most things need to be configured manually. The benefit of this is that
most of everything on how the LSP client behaves can be customized from keybindings to
default behavior. There are plenty of other things that can be customized but this basic
setup should get you started on using the power of LSP servers in nvim. If you need more
assistance or have any ideas for improvement feel free to send me an email at
[miika@miikanissi.com](mailto:miika@miikanissi.com).
