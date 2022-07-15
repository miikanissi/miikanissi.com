---
title: "Managing Dotfiles With Git"
description:
  "Managing and tracking dotfiles aka user specific application configuration files with
  Git."
date: 2020-12-20T00:00:00-04:00
---

Dotfiles are user specific application configuration files. Traditionally they are
stored as files whose filename starts with a dot, hence the term dotfiles. It is common
to track these dotfiles with a version control system such as Git for easy portability
between systems. In this post I will show my way of tracking and managing these
dotfiles.

## Setup

For easy management of all dotfiles in the home directory I like to create a git
repository which has a work tree in the `$HOME` directory but a seperate git directory
in `$HOME/dotfiles`. That way this git repository won't get in the way of other
potential Git repositories you might have in your home directory or in subdirectories.

To do this you first need to create a directory dotfiles in your home directory:

```bash
mkdir dotfiles
```

Next we create an alias so we don't need to type this long command every time. To do
this paste the following:

```bash
echo "alias dotfiles=\"git --work-tree $HOME --git-dir $HOME/dotfiles\"" \
>> ~/.bashrc && bash
```

We can now initialize the dotfiles directory as a git directory inside of it by running:

```bash
dotfiles init
```

To add a remote origin for this repository we run:

```bash
dotfiles remote add -t \* -f origin <url-of-the-remote-repository>
```

If this new remote repository already has dotfiles that you want to sync with your
system you can simply checkout the branch you want. For example
`dotfiles checkout master`.

That is all you need to do to create this git repository, and you can do all the normal
git specific commands but you just need to use dotfiles instead of git as the prefix. To
add a new file to be tracked by this repository you would do:

```bash
dotfiles add <filename> ;\
dotfiles commit -m "<Your commit message>" ;\
dotfiles push origin master
```

Since your home directory has a lot of files you would most likely want to ignore all
untracked files when checking the status of this git repository. For that we can run:

```bash
dotfiles config --local status.showUntrackedFiles no
```

## Afterword

This is how I personally manage my own dotfiles and found this solution easier than
other solutions such as symlinks, rsync, ansible and so on. If you are interested in my
own personal dotfiles you can check them out on my
[GitHub](https://github.com/miikanissi/dotfiles).
