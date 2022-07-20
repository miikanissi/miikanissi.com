---
title: "Suckless Dwm Dmenu and St"
date: 2021-06-28T21:08:01-04:00
description:
  "Minimalist window manager setup with suckless software: dwm, dmenu, and st."
---

I've been a fan of minimalist software for quite a while now and I'm always looking for
more simple and reliable technology. Suckless is a community of programmers who have
made some great pieces of minimalist software that I recently started using. In this
post I want to showcase my setup and some thoughts.

## Dwm - a Dynamic Window Manager

[dwm](https://dwm.suckless.org/), like all of suckless software, has no configuration
files or options. Everything is hard-coded into the source code. To customize dwm, you
need to modify the source code and compile it yourself. There are no binary releases at
all.

This process of modifying the source code might be intimidating but due to the community
around suckless software there are countless of patches available for different needs.
Here is a list of patches I'm currently using for dwm:

- [actualfullscreen](https://dwm.suckless.org/patches/actualfullscreen/), allows
  toggling a window as fullscreen.
- [alwayscenter](https://dwm.suckless.org/patches/alwayscenter/), all floating windows
  are centered on spawn.
- [attachbottom](https://dwm.suckless.org/patches/attachbottom/), new windows are
  attached to the bottom of the stack instead of top.
- [autostart](https://dwm.suckless.org/patches/autostart/), run a custom bash script on
  dwm startup.
- [colorbar](https://dwm.suckless.org/patches/colorbar/), ability to change the colors
  of the bar for every element.
- [hide vacant tags](https://dwm.suckless.org/patches/hide_vacant_tags/), hides all the
  tags not in use from the bar.
- [pertag](https://dwm.suckless.org/patches/pertag/), allows each tag to have a
  different layout.
- [stacker](https://dwm.suckless.org/patches/stacker/), move windows up/down the stack.
- [staticstatus](https://dwm.suckless.org/patches/staticstatus/), statusbar only on one
  monitor.
- [statuscmd](https://dwm.suckless.org/patches/statuscmd/), ability to have clickable
  statusbar items.
- [vanitygaps](https://dwm.suckless.org/patches/vanitygaps/), adds gaps between windows.
- [xrdb](https://github.com/miikanissi/dotfiles/blob/master/.local/src/suckless/dwm/patches/dwm-xrdb-6.2.diff),
  reads colors from `~/.Xresources` at run time.

As you can see, I have quite a list of extra patches applied to dwm, increasing the
lines of code from around 2000 to 2700. I see many of these patches as almost necessary,
such as the fullscreen patch or the stacker patch.

### Dwmblocks - a Status Bar for Dwm

[dwmblocks](https://github.com/torrinfail/dwmblocks) is a modular status bar for dwm. It
is not made by suckless but it follows the same spirit of suckless software by being
source based and only 200 lines of code.

"Blocks" are shell scripts that output some information. You can then define how often
or what signal is needed to run the script. For example I have this script for my clock
that runs every 30 seconds outputting the date and time. Clicking the clock opens a
terminal with `calcurse`.

```bash
#!/bin/sh

case $BUTTON in
    1) setsid -f $TERMINAL -e calcurse ;;
esac
date "+ %Y %b %d (%a), %-I:%M%p"
```

## Dmenu - a Dynamic Menu

[dmenu](https://tools.suckless.org/dmenu/) is a dynamic menu which allows you to create
different prompts. By default dmenu has a basic run prompt to launch applications.

I have also made a few scripts utilizing dmenu such as
[dman](https://github.com/miikanissi/dotfiles/blob/master/.local/bin/dman.sh), which
allows you to mount/unmount devices, and
[killprocess](https://github.com/miikanissi/dotfiles/blob/master/.local/bin/killprocess.sh),
which allows you to easily kill unresponsive programs.

Another useful dmenu script I found is
[passmenu](https://github.com/miikanissi/dotfiles/blob/master/.local/bin/passmenu.sh).
Passmenu allows you to get your passwords from Pass (The Standard UNIX Password
Manager). I have made a seperate blog post about Pass
[here]({{< relref "/pass-the-standard-unix-password-manager.md" >}}).

I also have applied a couple of dmenu patches:

- [xresources-alt](https://tools.suckless.org/dmenu/patches/xresources-alt/), reads
  colors from `~/.Xresources`.
- [password](https://tools.suckless.org/dmenu/patches/password/), allows dmenu to hide
  keyboard input as dots with the option `-P`.

## St - a Simple Terminal

You'd think finding a good terminal emulator that is fast and simple wouys be easy. I
have tried xterm, urxvt, alacritty, kitty and so on, but they either lack basic features
or are too slow and complicated for no reason. However [st](https://st.suckless.org/) is
a simple terminal emulator for X that works great with a few extra patches.

The patches I have applied are:

- [bold is not bright](https://st.suckless.org/patches/bold-is-not-bright/), renders
  bold font with same color as regular font.
- [scrollback](https://st.suckless.org/patches/scrollback/), allows scrolling back and
  forth on the terminal.
- [xresources](https://st.suckless.org/patches/xresources/), reads colors and other
  options from `~/.Xresources`.

## Afterword

At first I was hesitant to use suckless software because it is source based which made
it seem intimidating. But the initial learning curve was worth it. Now I have my own
custom builds of these programs and everything works great. I will keep this post
updated if I face any problems or I make further changes. So far I'm more than pleased.
