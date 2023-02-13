---
title: "How to Setup Nvim LSP for Code Analysis, Autocompletion and Linting"
date: 2022-07-15T17:50:01-04:00
description:
  "Guide on how to setup LSP on nvim for code analysis, autocompletion, and automatic
  code linting and fixing."
---

Neovim or Nvim has come a long way to overtake vim with support of a multitude of new
features natively out of the box. One of these features is the support for the Language
Server Protocol (LSP), which means Nvim acts as a client to LSP servers. In order to
take advantage of this feature, there are a couple of important plugins that do the
heavy lifting of getting a working LSP server and client communication set up. In this
post I will go over what you need to get started on how to set up Nvim LSP client for
analyzing code, autocompletion and even automatic code linting and fixing.

## Installing the Nvim Plugins With Packer

To get started, we first need to install the plugins. My preferred Nvim plugin manager
is [Packer](https://github.com/wbthomason/packer.nvim), but this step can be done with
any other plugin manager as well. Please note, I am configuring Nvim in an `init.lua`
file. To learn more about how to configure Nvim in Lua you may refer to
[this helpful guide](https://github.com/nanotee/nvim-lua-guide).

```lua
require('packer').startup(function(use)
    --
    -- ...
    --
	use({
		"neovim/nvim-lspconfig",
		requires = {
			-- Automatically install LSPs to stdpath for neovim
			"williamboman/mason.nvim",
			"williamboman/mason-lspconfig.nvim",
		},
	}) -- Collection of configurations for built-in LSP client
	use("jose-elias-alvarez/null-ls.nvim") -- Null ls is used for code formatting and pylint analysis
    use 'hrsh7th/nvim-cmp' -- Autocompletion plugin
    use 'hrsh7th/cmp-nvim-lsp' -- Autocompletion with LSPs
    --
    -- ...
    --
end)
```

After saving the `init.lua` we can run `:PackerSync` to install the declared packages.

## Installing and configuring LSP Servers

In order to install and configure the LSP servers used by the Nvim LSP client, we use a
helpful plugin called [mason.nvim](https://github.com/williamboman/mason.nvim) and
[mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim). It is not
necessary to use this plugin as each LSP server can be installed manually, but I like to
use this plugin for convenience.

Below is a snippet of my setup for mason.nvim. For a full list of supported LSPs refer
to [this manual](https://github.com/williamboman/mason.nvim/blob/main/PACKAGES.md).

First, we define the common on_attach and capabilities functions for the LSPs. In the
on_attach function we define the keymappings to interact with the LSP server. In
capabilities function we hook the autocompletion plugin, so we get LSP completion
suggestions.

```lua
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities = require("cmp_nvim_lsp").default_capabilities(capabilities)

local on_attach = function(_, bufnr)
	local nmap = function(keys, func, desc)
		if desc then
			desc = "LSP: " .. desc
		end

		vim.keymap.set("n", keys, func, { buffer = bufnr, desc = desc })
	end

	-- Theme, colors and gui
	nmap("<leader>rn", vim.lsp.buf.rename, "[R]e[n]ame")
	nmap("<leader>ca", vim.lsp.buf.code_action, "[C]ode [A]ction")

	nmap("gd", vim.lsp.buf.definition, "[G]oto [D]efinition")
	nmap("gr", require("telescope.builtin").lsp_references, "[G]oto [R]eferences")
	nmap("gI", vim.lsp.buf.implementation, "[G]oto [I]mplementation")
	nmap("<leader>D", vim.lsp.buf.type_definition, "Type [D]efinition")
	nmap("<leader>ds", require("telescope.builtin").lsp_document_symbols, "[D]ocument [S]ymbols")
	nmap("<leader>ws", require("telescope.builtin").lsp_dynamic_workspace_symbols, "[W]orkspace [S]ymbols")

	-- See `:help K` for why this keymap
	nmap("K", vim.lsp.buf.hover, "Hover Documentation")
	nmap("<C-k>", vim.lsp.buf.signature_help, "Signature Documentation")

	-- Lesser used LSP functionality
	nmap("gD", vim.lsp.buf.declaration, "[G]oto [D]eclaration")
	nmap("<leader>wa", vim.lsp.buf.add_workspace_folder, "[W]orkspace [A]dd Folder")
	nmap("<leader>wr", vim.lsp.buf.remove_workspace_folder, "[W]orkspace [R]emove Folder")
	nmap("<leader>wl", function()
		print(vim.inspect(vim.lsp.buf.list_workspace_folders()))
	end, "[W]orkspace [L]ist Folders")

	-- Create a command `:Format` local to the LSP buffer
	vim.api.nvim_buf_create_user_command(bufnr, "Format", function(_)
		vim.lsp.buf.format()
	end, { desc = "Format current buffer with LSP" })
end
```

Next, we need to define the LSP servers we want to enable and pass any custom settings.
Following is what servers I'm using. You can customize the list as you wish. For the
full list of available LSP servers refer to this
[document](https://github.com/williamboman/mason.nvim/blob/main/PACKAGES.md).

```lua
local servers = {
	pyright = {},
	eslint = {
		codeAction = {
			disableRuleComment = {
				enable = true,
				location = "separateLine",
			},
			showDocumentation = {
				enable = true,
			},
		},
		codeActionOnSave = {
			enable = false,
			mode = "all",
		},
		format = false,
		nodePath = "",
		onIgnoredFiles = "off",
		packageManager = "npm",
		quiet = false,
		rulesCustomizations = {},
		run = "onType",
		useESLintClass = false,
		validate = "on",
		workingDirectory = {
			mode = "location",
		},
	},
	bashls = {},
	cssls = {},
	html = {},
	jsonls = {},
	lemminx = {},
	gopls = {},
	lua_ls = {
		Lua = {
			workspace = { checkThirdParty = false },
			telemetry = { enable = false },
			diagnostics = {
				globals = { "vim" },
			},
		},
	},
}
```

In this final part, we pass these functions and the list of servers to mason.nvim which
handles the rest.

```lua
-- MASON.NVIM
require("mason").setup()

-- MASON-LSPCONFIG.NVIM
local mason_lspconfig = require("mason-lspconfig")
mason_lspconfig.setup({
	ensure_installed = vim.tbl_keys(servers),
})

mason_lspconfig.setup_handlers({
	function(server_name)
		require("lspconfig")[server_name].setup({
			capabilities = capabilities,
			on_attach = on_attach,
			settings = servers[server_name],
		})
	end,
})
```

### Enable Autocompletion and Add Additional Keybindings

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

## Automatic Code Linting and Fixing on Save Using Null-ls

So far, we have installed all the necessary plugins and enabled LSP servers with custom
keybindings and autocompletion. Now we can use a plugin called
[null-ls](https://github.com/jose-elias-alvarez/null-ls.nvim) to automatically use any
available linters on a file to fix code formatting on file save. Refer to the available
sources in the
[manual](https://github.com/jose-elias-alvarez/null-ls.nvim/blob/main/doc/BUILTINS.md).

```lua
-- NULL-LS.NVIM
-- LSP formatting filter
local lsp_formatting = function(bufnr)
	vim.lsp.buf.format({
		filter = function(client)
			-- Ignore formatting from these LSPs
			local lsp_formatting_denylist = {
				eslint = true,
				lemminx = true,
				lua_ls = true,
			}
			if lsp_formatting_denylist[client.name] then
				return false
			end
			return true
		end,
		bufnr = bufnr,
	})
end

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
					lsp_formatting(bufnr)
				end,
			})
		end
	end,
	sources = {
		require("null-ls").builtins.formatting.prettier.with({
			extra_filetypes = { "xml" },
		}),
		require("null-ls").builtins.formatting.black,
		require("null-ls").builtins.formatting.djlint,
		require("null-ls").builtins.formatting.isort,
		require("null-ls").builtins.formatting.stylua,
		require("null-ls").builtins.diagnostics.djlint,
		require("null-ls").builtins.diagnostics.flake8,
		require("null-ls").builtins.diagnostics.pylint,
	},
})
```

## Afterword

Setting up the Nvim LSP client to work with different LSP servers can seem a bit
intimidating, as most things need to be configured manually. The benefit of this is that
most everything on how the LSP client behaves can be customized, from keybindings to
default behavior. There are plenty of other things that can be customized, but this
basic setup should get you started on using the power of LSP servers in Nvim. If you
need more assistance or have any ideas for improvement, feel free to email me at
[miika@miikanissi.com](mailto:miika@miikanissi.com).
