---
title: "Laptop Dual Monitor Hot Plug Setup for BSPWM"
date: 2022-06-10T20:35:10-04:00
description:
  "Guide on how to setup automatic monitor hotplugging with BSPWM window manager. "
---

There are many features people take for granted on a typical desktop environment such as
[Gnome](https://www.gnome.org/) or [KDE](https://kde.org/). One of these features is the
support for hot plugging an external monitor to a laptop while it's running and having
your desktop environment set everything up automatically. On a minimal window manager
setup, features like these are typically missing and you are required to configure
everything manually. This post will go over my own monitor hot plugging setup and
scripts for [BSPWM](https://github.com/baskerville/bspwm). Every window manager is
different and this configuration might not work for [i3](https://i3wm.org/) or
[dwm](https://dwm.suckless.org/), but it might give an idea of things that need to be
considered.

## BSPWM Startup

The first thing to consider with an external monitor setup is what happens on startup.
When you boot up your laptop with no external monitors connected you should have
everything on your laptop display. However, if you have an external monitor attached on
boot up, you should allocate some workspaces and a status bar to both monitors.

Every time BSPWM loads up it automatically runs it's configuration file located in
`~/.config/bspwm/bspwmrc`. This configuration file is just a shell script so you can run
any command-line commands and tools directly inside of the configuration file. In this
file we can define the amount of workspaces to create depending on what monitors are
connected.

In the following snippet of the configuration file, we first define the internal and
external monitor connected to the laptop. You can get the monitor names by running
`xrandr -q` while your external monitor is connected. After defining the monitors we
check to see if BSPWM is loading for the first time of the session. This is important
because we don't want to create additional workspaces every time BSPWM is reloaded. We
can access this information by getting the first passed parameter with `$1`. This
parameter tells us the amount of reloads in the session. If the number is 0 we know that
we are loading BSPWM for the first time. Next we use XRandR to query for the status of
the external monitor. If it is connected we assing half of the workspaces to it and the
other half to the internal monitor. If the external monitor is not connected we create
all 10 workspaces on the internal monitor.

```bash
INTERNAL_MONITOR="eDP"
EXTERNAL_MONITOR="HDMI-A-0"
# on first load setup default workspaces
if [[ "$1" = 0 ]]; then
  if [[ $(xrandr -q | grep "${EXTERNAL_MONITOR} connected") ]]; then
    bspc monitor "$EXTERNAL_MONITOR" -d 1 2 3 4 5
    bspc monitor "$INTERNAL_MONITOR" -d 6 7 8 9 10
    bspc wm -O "$EXTERNAL_MONITOR" "$INTERNAL_MONITOR"
  else
    bspc monitor "$INTERNAL_MONITOR" -d 1 2 3 4 5 6 7 8 9 10
  fi
fi
```

## External Monitor Is Connected During a Session

Next we create a function where we write the logic which we want to happen when an
external monitor is plugged in during the session. Here we simply want to move half of
the workspaces to the newly connected monitor and we also want to make sure that the
external monitor becomes the new primary monitor.

```bash
monitor_add() {
  # Move first 5 desktops to external monitor
  for desktop in $(bspc query -D --names -m "$INTERNAL_MONITOR" | sed 5q); do
    bspc desktop "$desktop" --to-monitor "$EXTERNAL_MONITOR"
  done

  # Remove default desktop created by bspwm
  bspc desktop Desktop --remove

  # reorder monitors
  bspc wm -O "$EXTERNAL_MONITOR" "$INTERNAL_MONITOR"
}
```

## External Monitor Is Removed

When the external monitor is removed we essentially want the opposite to happen. We want
to move all of the workspaces (and the windows they contain) from our external monitor
back to the internal monitor which becomes the new primary monitor.

```bash
monitor_remove() {
  # Add default temp desktop because a minimum of one desktop is required per monitor
  bspc monitor "$EXTERNAL_MONITOR" -a Desktop

  # Move all desktops except the last default desktop to internal monitor
  for desktop in $(bspc query -D -m "$EXTERNAL_MONITOR");	do
    bspc desktop "$desktop" --to-monitor "$INTERNAL_MONITOR"
  done

  # delete default desktops
  bspc desktop Desktop --remove

  # reorder desktops
  bspc monitor "$INTERNAL_MONITOR" -o 1 2 3 4 5 6 7 8 9 10
}
```

## Putting It All Together

Now that we have our functions declared all that is missing is writing the logic to
trigger them. This is done at the end of the configuration file. Here we once again use
XRandR to check for the state of our external monitor. If it is connected we want to
setup its resolution, position and to make it the primary monitor. After that, we check
if the monitor already has half of the workspaces on it. If not, we know this monitor
was recently connected and we want to run our `monitor_add` function.

In the situation we only have one monitor connected and we check to see if it already
has all of the workspaces assigned to it. If that is not the case we run the
`monitor_remove` function. In this case we also use XRandR to only setup the internal
monitor.

```bash
if [[ $(xrandr -q | grep "${EXTERNAL_MONITOR} connected") ]]; then
  # set xrandr rules for docked setup
  xrandr --output "$INTERNAL_MONITOR" --mode 1920x1080 --pos 0x0 --rotate normal --output "$EXTERNAL_MONITOR" --primary --mode 1920x1080 --pos 1920x0 --rotate normal
  if [[ $(bspc query -D -m "${EXTERNAL_MONITOR}" | wc -l) -ne 5 ]]; then
    monitor_add
  fi
  bspc wm -O "$EXTERNAL_MONITOR" "$INTERNAL_MONITOR"
else
  # set xrandr rules for mobile setup
  xrandr --output "$INTERNAL_MONITOR" --primary --mode 1920x1080 --pos 0x0 --rotate normal --output "$EXTERNAL_MONITOR" --off
  if [[ $(bspc query -D -m "${INTERNAL_MONITOR}" | wc -l) -ne 10 ]]; then
    monitor_remove
  fi
fi
```

## Automatically Detect a Screen Change

At this point our configuration is fully working and every time we reload BSPWM it
checks for the state of the monitors and sets them up correctly. However, we have not
made BSPWM make an automatic reload when a screen change occurs. In order to do this we
need to create a custom Udev rule. Udev monitors device events and we can use it to
reload BSPWM automatically when a monitor gets plugged in or out. I won't be going into
detail on how Udev rules work but you can read more about them
[here](https://wiki.debian.org/udev).

In the following snippet make sure to replace the `m` after `/bin/su` and `/home/` as
your own username. Save this snippet in a file called
`/etc/udev/rules.d/99-reload-monitor.rules`.

```text
ACTION=="change", SUBSYSTEM=="drm", RUN+="/bin/su m --command='/home/m/.config/bspwm/bspwmrc'"
```

## Bonus: Set a Wallpaper and Run Polybar

After a new monitor is added it won't have any wallpaper by default. This is why in the
configuration file after we setup our monitors we want to use some program such as
[feh](https://feh.finalrewind.org/) to add a wallpaper. This can be done with the
following snippet:

```bash
feh --no-fehbg --bg-scale <path-to-wallpaper>
```

The simplest way of setting [Polybar](https://github.com/polybar/polybar) is to first
make sure we kill all existing polybar processes and then we relaunch it based on what
monitors are connected. The following polybar command has the option `--reload` which
will monitor any changes to polybar and automatically reload it when a configuration is
changed.

```bash
# Kill and relaunch polybar
killall -q polybar
while pgrep -u $UID -x polybar > /dev/null; do sleep 2; done
if [[ $(xrandr -q | grep "${EXTERNAL_MONITOR} connected") ]]; then
  polybar --reload primary -c ~/.config/polybar/config.ini </dev/null >/var/tmp/polybar-primary.log 2>&1 200>&- &
  polybar --reload secondary -c ~/.config/polybar/config.ini </dev/null >/var/tmp/polybar-secondary.log 2>&1 200>&- &
else
  polybar --reload primary -c ~/.config/polybar/config.ini </dev/null >/var/tmp/polybar-primary.log 2>&1 200>&- &
fi
```

## Afterword

In case you need more help with your BSPWM setup, feel free to contact me by email at
[miika@miikanissi.com](mailto:miika@miikanissi.com). You can find the rest of my
configuration in my [dotfiles](https://github.com/miikanissi/dotfiles) repository.
Specifically, you can check
[here to see my bspwmrc](https://github.com/miikanissi/dotfiles/blob/d22a55006d449d420617ae233add6cd0c83aca53/.config/bspwm/bspwmrc)
at the time of writing this post and
[here for the associated monitor setup script](https://github.com/miikanissi/dotfiles/blob/d22a55006d449d420617ae233add6cd0c83aca53/.local/bin/bspwm_setup_monitors.sh).
