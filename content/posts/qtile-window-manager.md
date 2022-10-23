---
title: "Qtile Window Manager"
date: 2021-11-30T17:23:03-04:00
description: "Minimal tiling window manager desktop environment with Qtile in Python."
---

I love tinkering with different Linux window managers and desktop environments. My
latest interest has been [Qtile](http://www.qtile.org/). It is a dynamic tiling window
manager written and configured in Python. I chose to give Qtile a try as I mainly
program in Python on a day-to-day basis and thought it was a good idea to have a window
manager which uses the same language.

After a couple of weeks of use, I'm already loving the customizability and workflow. In
this post, I will shortly go over my setup and share my configuration files.

## My Setup

![Desktop Environment screenshot](/media/desktop.png)

My setup is similar to what I have used in the past. I have a top bar which contains
basic information such as time, date, volume, battery, system tray, workspaces and so
on. The main color scheme I went with was a
[Gruvbox community light theme](https://github.com/gruvbox-community/gruvbox). This is a
very pleasant theme on the eyes, and I'm a big fan of light color themes.

The rest of my setup is mostly the same as previously, with Vim as my main text editor.
Dunts as a notification manager. LightDM as a display manager. Autorandr to hot plug my
external laptop monitors. Network Manager as a network manager (duh). St as my terminal
emulator and bash as a shell.

Configuration file for Qtile:

```python
# ~/.config/qtile/config.py
# Miika Nissi, https://miikanissi.com
# Standard library imports
import os
import subprocess
from typing import List

# Qtile imports
from libqtile import bar, layout, widget, hook, qtile
from libqtile.config import Click, Drag, Group, Key, Match, Screen
from libqtile.lazy import lazy

# Third party imports
# For dynamic multiscreen, install xlib from pip
from Xlib import display

# colors
black = "#f9f5d7"
black0 = "#928374"
red = "#cc241d"
red0 = "#9d0006"
green = "#98971a"
green0 = "#79740e"
yellow = "#d79921"
yellow0 = "#b57614"
blue = "#458588"
blue0 = "#076678"
purple = "#b16286"
purple0 = "#8f3f71"
aqua = "#689d6a"
aqua0 = "#427b58"
white = "#7c6f64"
white0 = "#3c3836"
background = black
foreground = white0
soft = "#f2e5bc"

# Global variables
mod = "mod4"
terminal = "st"
browser = "brave-browser"
file_browser = "pcmanfm"
home = os.path.expanduser("~")
slash = ""
separator = slash

# Dynamic multiscreen setup
d = display.Display()
s = d.screen()
r = s.root
res = r.xrandr_get_screen_resources()._data

screen_count = 0
for output in res["outputs"]:
    mon = d.xrandr_get_output_info(output, res["config_timestamp"])._data
    if mon["num_preferred"] and mon["crtc"]:
        screen_count += 1
if screen_count == 0:
    screen_count = 1


@hook.subscribe.client_new
def transient_window(window):
    if window.window.get_wm_transient_for():
        window.floating = True


@hook.subscribe.startup_once
def autostart():
    """ Programs to start when window manager is loading """
    autostart = os.path.expanduser("~/.config/qtile/autostart.sh")
    subprocess.call([autostart])


keys = [
    # Switch between windows
    Key([mod], "h", lazy.layout.left(), desc="Move focus to left"),
    Key([mod], "l", lazy.layout.right(), desc="Move focus to right"),
    Key([mod], "j", lazy.layout.down(), desc="Move focus down"),
    Key([mod], "k", lazy.layout.up(), desc="Move focus up"),
    Key([mod], "space", lazy.layout.next(), desc="Move window focus to other window"),
    # Move windows between left/right columns or move up/down in current stack.
    # Moving out of range in Columns layout will create new column.
    Key(
        [mod, "shift"], "h", lazy.layout.shuffle_left(), desc="Move window to the left"
    ),
    Key(
        [mod, "shift"],
        "l",
        lazy.layout.shuffle_right(),
        desc="Move window to the right",
    ),
    Key([mod, "shift"], "j", lazy.layout.shuffle_down(), desc="Move window down"),
    Key([mod, "shift"], "k", lazy.layout.shuffle_up(), desc="Move window up"),
    # Grow windows. If current window is on the edge of screen and direction
    # will be to screen edge - window would shrink.
    Key([mod, "control"], "h", lazy.layout.grow_left(), desc="Grow window to the left"),
    Key(
        [mod, "control"], "l", lazy.layout.grow_right(), desc="Grow window to the right"
    ),
    Key([mod, "control"], "j", lazy.layout.grow_down(), desc="Grow window down"),
    Key([mod, "control"], "k", lazy.layout.grow_up(), desc="Grow window up"),
    Key([mod], "comma", lazy.prev_screen(), desc="Focus to the left screen"),
    Key([mod], "period", lazy.next_screen(), desc="Focus to the right screen"),
    Key([mod], "n", lazy.layout.normalize(), desc="Reset all window sizes"),
    # Toggle between split and unsplit sides of stack.
    # Split = all windows displayed
    # Unsplit = 1 window displayed, like Max layout, but still with
    # multiple stack panes
    Key(
        [mod, "shift"],
        "Return",
        lazy.layout.toggle_split(),
        desc="Toggle between split and unsplit sides of stack",
    ),
    Key([mod], "Return", lazy.spawn(terminal), desc="Launch terminal"),
    # Toggle between different layouts as defined below
    Key([mod], "Tab", lazy.next_layout(), desc="Toggle between layouts"),
    Key([mod, "shift"], "c", lazy.window.kill(), desc="Kill focused window"),
    Key([mod, "shift"], "r", lazy.reload_config(), desc="Reload the config"),
    Key(
        [mod, "shift"],
        "q",
        lazy.spawn(
            "rofi -show powermenu -modi powermenu:"
            + home
            + "/.local/bin/rofi_powermenu.sh"
        ),
        desc="Shutdown Qtile",
    ),
    Key([mod], "t", lazy.window.toggle_floating(), desc="Toggle floating window"),
    Key([mod], "f", lazy.window.toggle_fullscreen(), desc="Toggle fullscreen window"),
    # programs
    Key([mod], "d", lazy.spawn("rofi -show run"), desc="Spawn Rofi run prompt"),
    Key(
        [mod, "shift"],
        "d",
        lazy.spawn(home + "/.local/bin/rofi_passmenu.sh"),
        desc="Spawn Rofi passmenu",
    ),
    Key(
        [mod, "shift", "control"],
        "d",
        lazy.spawn(home + "/.local/bin/rofi_passmenu_otp.sh"),
        desc="Spawn Rofi passmenu one time password",
    ),
    Key(
        [mod],
        "z",
        lazy.spawn(home + "/.local/bin/rofi_dman.sh"),
        desc="Spawn Rofi device manager",
    ),
    Key(
        [mod],
        "x",
        lazy.spawn(home + "/.local/bin/rofi_killprocess.sh"),
        desc="Spawn Rofi process manager",
    ),
    Key(
        [mod],
        "q",
        lazy.spawn(home + "/.local/bin/rofi_power_menu.sh"),
        desc="Spawn Rofi power menu",
    ),
    Key(
        [mod, "shift"],
        "Print",
        lazy.spawn(home + "/.local/bin/screenrecord.sh"),
        desc="Screenrecord gif",
    ),
    Key([mod], "Print", lazy.spawn("flameshot gui"), desc="Screenshot tool"),
    Key([mod], "w", lazy.spawn(browser), desc="Launch browser"),
    Key([mod], "b", lazy.spawn(file_browser), desc="Launch file browser"),
    Key([mod], "e", lazy.spawn("geary"), desc="Launch email client"),
    Key(
        [mod],
        "s",
        lazy.spawn("signal-desktop --start-in-tray --use-tray-icon"),
        desc="Launch Signal messenger",
    ),
    Key(
        [mod],
        "m",
        lazy.spawn(terminal + " -n ncmpcpp -t ncmpcpp -e ncmpcpp"),
        desc="Launch NCMPCPP music player",
    ),
]

groups = [Group(i) for i in "123456789"]

for i in groups:
    keys.extend(
        [
            # mod1 + letter of group = switch to group
            Key(
                [mod],
                i.name,
                lazy.group[i.name].toscreen(),
                desc="Switch to group {}".format(i.name),
            ),
            # mod1 + shift + letter of group = switch to & move focused window to group
            Key(
                [mod, "shift"],
                i.name,
                lazy.window.togroup(i.name, switch_group=True),
                desc="Switch to & move focused window to group {}".format(i.name),
            ),
            # Or, use below if you prefer not to switch to that group.
            # # mod1 + shift + letter of group = move focused window to group
            # Key([mod, "shift"], i.name, lazy.window.togroup(i.name),
            #     desc="move focused window to group {}".format(i.name)),
        ]
    )

layouts = [
    layout.Columns(
        border_focus=[purple],
        border_normal=[black0],
        border_width=3,
        insert_position=1,
    ),
    layout.Max(),
]

widget_defaults = dict(
    font="Ubuntu",
    fontsize=12,
    padding=3,
    background=background,
    foreground=foreground,
)
extension_defaults = widget_defaults.copy()

caffeine = widget.GenPollText(
    update_interval=1,
    func=lambda: subprocess.check_output(
        home + "/.local/bin/statusbar/caffeine.sh"
    ).decode("utf-8"),
    mouse_callbacks={
        "Button1": lambda: qtile.cmd_spawn(
            home + "/.local/bin/statusbar/caffeine.sh --toggle"
        )
    },
    font="UbuntuNerdFont",
    fontsize=16,
    padding_right=4,
    padding_left=0,
)
powermenu = widget.TextBox(
    text="",
    foreground=red,
    padding=4,
    font="UbuntuNerdFont",
    fontsize=16,
    mouse_callbacks={
        "Button1": lambda: qtile.cmd_spawn(
            "rofi -show powermenu -modi powermenu:"
            + home
            + "/.local/bin/rofi_powermenu.sh"
        )
    },
)
volume = widget.Volume(volume_app="pavucontrol", background=soft, padding=0)
battery = widget.Battery(
    format="{char}{percent:2.0%}",
    unknown_char="",
    show_short_text=False,
    low_foreground=red,
    notify_below=10,
    padding=0,
)
mpd = widget.Mpd2(
    idle_message="idle",
    idle_format="{play_status} [{repeat}{random}{single}{consume}{updating_db}] {idle_message}",
    status_format="{play_status} [{repeat}{random}{single}{consume}{updating_db}] {artist} - {title}",
    no_connection="",
    space="",
)

screens = [
    Screen(
        top=bar.Bar(
            [
                widget.CurrentLayoutIcon(padding=3),
                widget.GroupBox(
                    highlight_method="line",
                    disable_drag=True,
                    hide_unused=True,
                    active=foreground,
                    inactive=black0,
                    block_highlight_text_color=foreground,
                    this_screen_border=purple,
                    this_current_screen_border=purple,
                    other_screen_border=black0,
                    other_current_screen_border=foreground,
                    highlight_color=[black0],
                    padding=6,
                    spacing=0,
                    margin_x=0,
                ),
                widget.WindowName(for_current_screen=True, padding=6),
                mpd,
                widget.TextBox(
                    padding=0,
                    text=separator,
                    foreground=soft,
                    fontsize=28,
                    font="UbuntuNerdFont",
                ),
                widget.TextBox(text="vol:", background=soft),
                volume,
                widget.TextBox(
                    padding=0,
                    text=separator,
                    background=soft,
                    foreground=background,
                    fontsize=28,
                    font="UbuntuNerdFont",
                ),
                widget.TextBox(text="bat:"),
                battery,
                widget.TextBox(
                    padding=0,
                    text=separator,
                    foreground=soft,
                    fontsize=28,
                    font="UbuntuNerdFont",
                ),
                widget.Clock(format="%I:%M%P %m/%d/%Y", background=soft, padding=0),
                widget.TextBox(
                    padding=0,
                    text=separator,
                    background=soft,
                    foreground=background,
                    fontsize=28,
                    font="UbuntuNerdFont",
                ),
                caffeine,
                widget.Systray(padding=2),
                powermenu,
            ],
            26,
            background=background,
        ),
    ),
]
if screen_count > 1:
    for screen in range(0, screen_count):
        screens.append(
            Screen(
                top=bar.Bar(
                    [
                        widget.CurrentLayoutIcon(padding=3),
                        widget.GroupBox(
                            highlight_method="line",
                            disable_drag=True,
                            hide_unused=True,
                            active=foreground,
                            inactive=black0,
                            block_highlight_text_color=foreground,
                            this_screen_border=purple,
                            this_current_screen_border=purple,
                            other_screen_border=black0,
                            other_current_screen_border=foreground,
                            highlight_color=[black0],
                            padding=6,
                            spacing=0,
                            margin_x=0,
                        ),
                        widget.WindowName(for_current_screen=True, padding=6),
                        widget.TextBox(
                            padding=0,
                            text=separator,
                            foreground=soft,
                            fontsize=28,
                            font="UbuntuNerdFont",
                        ),
                        widget.TextBox(text="vol:", background=soft),
                        volume,
                        widget.TextBox(
                            padding=0,
                            text=separator,
                            background=soft,
                            foreground=background,
                            fontsize=28,
                            font="UbuntuNerdFont",
                        ),
                        widget.TextBox(text="bat:"),
                        battery,
                        widget.TextBox(
                            padding=0,
                            text=separator,
                            foreground=soft,
                            fontsize=28,
                            font="UbuntuNerdFont",
                        ),
                        widget.Clock(
                            format="%I:%M%P %m/%d/%Y", background=soft, padding=0
                        ),
                        widget.TextBox(
                            padding=0,
                            text=separator,
                            background=soft,
                            foreground=background,
                            fontsize=28,
                            font="UbuntuNerdFont",
                        ),
                        caffeine,
                        widget.TextBox(),
                        powermenu,
                    ],
                    26,
                    background=background,
                ),
            ),
        )

# Drag floating layouts.
mouse = [
    Drag(
        [mod],
        "Button1",
        lazy.window.set_position_floating(),
        start=lazy.window.get_position(),
    ),
    Drag(
        [mod], "Button3", lazy.window.set_size_floating(), start=lazy.window.get_size()
    ),
    Click([mod], "Button2", lazy.window.bring_to_front()),
]

dgroups_key_binder = None
dgroups_app_rules = []
follow_mouse_focus = True
bring_front_click = False
cursor_warp = False
floating_layout = layout.Floating(
    float_rules=[
        # Run the utility of `xprop` to see the wm class and name of an X client.
        *layout.Floating.default_float_rules,
        Match(title="Quit and close tabs?"),
        Match(wm_type="utility"),
        Match(wm_type="notification"),
        Match(wm_type="toolbar"),
        Match(wm_type="splash"),
        Match(wm_type="dialog"),
        Match(wm_class="ncmpcpp"),
        Match(wm_class="Conky"),
        Match(wm_class="file_progress"),
        Match(wm_class="confirm"),
        Match(wm_class="dialog"),
        Match(wm_class="download"),
        Match(wm_class="error"),
        Match(wm_class="notification"),
        Match(wm_class="splash"),
        Match(wm_class="toolbar"),
        Match(wm_class="confirmreset"),  # gitk
        Match(wm_class="makebranch"),  # gitk
        Match(wm_class="maketag"),  # gitk
        Match(wm_class="ssh-askpass"),  # ssh-askpass
        Match(title="branchdialog"),  # gitk
        Match(title="pinentry"),  # GPG key password entry
    ]
)
auto_fullscreen = False
focus_on_window_activation = "smart"
auto_minimize = False

# Needed for some Java programs
wmname = "LG3D"
# Fixes QT apps
os.environ["QT_QPA_PLATFORMTHEME"] = "qt5ct"
```

This configuration will surely change in the future, and you can always find my most
up-to-date setup on my [GitHub](https://github.com/miikanissi/dotfiles).
