---
title: "Configuring ESLint and Prettier for Vim With Ale"
date: 2021-05-22T00:56:55-04:00
description: "How to configure ESLint and Prettier for Vim with ALE for code linting."
---

Recently, I wanted to set up Vim with ESLint and Prettier for JavaScript development,
and it took me a surprisingly long time to find the best solution. In this post, I'm
going to go over the steps needed to get your JavaScript linting and automatic fixing
working inside of Vim.

## Asynchronous Lint Engine (ALE) for Vim

First, we are going to need a Vim plugin to help us integrate ESLint and Prettier into
Vim. [Asynchronous Lint Engine(ALE)](https://github.com/dense-analysis/ale) is a
Vim/Neovim plugin providing on-the-fly syntax checking and automatic file formatting. It
integrates with various linters and is easy to customize.

I'm not going to go into depth on all the different ways of installing VIM plugins. For
the sake of this post, we're going to use
[vim-plug](https://github.com/junegunn/vim-plug) as our plugin manager. I will assume
you already have it installed according to the installation instructions.

In your `vimrc` add:

```viml
call plug#begin('$HOME/.vim/plugged')
Plug 'dense-analysis/ale'
call plug#end()
```

Running `:PlugInstall` in Vim will install ALE for us, and we can move on.

## Installing ESLint and Prettier From NPM

Generally, I like to install all of my programs from the official repository of my Linux
distribution or build them from source. In this case, we need to use `npm` to install
[prettier-eslint](https://github.com/prettier/prettier-eslint). Prettier-eslint combines
[Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to format a
JavaScript file.

Prettier is an opinionated code formatter (sometimes too opinionated) and you might need
to follow a specific guideline provided by ESLint. Prettier-eslint first runs Prettier
on a JavaScript file. After formatting, it hands the process over to ESLint, which can
apply some specific changes based on [ESLint rules](https://eslint.org/docs/rules/).
ESLint rules are specified in a configuration file located in `~/.eslintrc*`.

To install `prettier-eslint` we need `npm`. Then we can run:

```bash
npm install -D --save-dev prettier-eslint-cli
```

## Vim Configuration for ALE and Prettier/ESLint

Most of the heavy lifting is automatically done by `prettier-eslint` so our VIM
configuration is pretty simple. To have ALE use `prettier-eslint`, we need to define it
as a "fixer" in our `vimrc`:

```viml
let g:ale_fixers = {
    \   'javascript': ['eslint'],
    \}
```

Now we can run `:ALEFix` in our JavaScript files to format and fix our code.

We should also define ESLint as our linter for JavaScript files. This means we will see
error messages on-the-fly as we work on our code.

```viml
let g:ale_linters = {
    \   'javascript': ['eslint'],
    \}
```

Personally, I like to have a few other configuration options for ALE. These include
fixing and formatting code on save, remove code highlighting on errors, and show error
and warning sings in the Vim sign column (on the left).

```viml
let g:ale_fix_on_save = 1
let g:ale_sign_error = '>>'
let g:ale_sign_warning = '--'
let g:ale_echo_msg_error_str = 'E'
let g:ale_echo_msg_warning_str = 'W'
let g:ale_echo_msg_format = '[%linter%] %s [%severity%]'
let g:ale_python_flake8_options = '--max-line-length 88 --extend-ignore=E203'
```

## Afterword

I felt the need to write this post as most solutions I could find on search engines were
outdated or unnecessarily complicated.

Notice a mistake in this post or need help setting up your JavaScript environment in
Vim? Feel free to contact me via email at `miika@miikanissi.com`.
