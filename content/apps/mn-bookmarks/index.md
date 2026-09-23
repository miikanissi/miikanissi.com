---
title: "MN Bookmarks"
summary: "A personal bookmarks bar that reopens any backend screen as it was"
description:
  "MN Bookmarks: a personal bookmarks bar for Odoo. One click saves the screen you're on
  — the app, the view, the record, the filters — and reopens it exactly as it was."
icon: "icon.svg"
price: 89.00
currency: "USD"
odoo_versions: [20]
store_url: "https://apps.odoo.com/apps/modules/mn_bookmarks"
license: "OPL-1"
---

<!-- DRAFT: for Miika's review. Adapted from readme/DESCRIPTION.md in the mn_bookmarks
module; check it still matches the current feature set before publishing. -->

One click saves the screen you're on. Opening the bookmark later brings it back exactly
as it was: the app, the view type, the record, and the search on it, with its filters,
groupings, sort and the view's own settings.

Runs on Odoo Community as well as Enterprise — it only depends on `web`, plus `web_tour`
for the onboarding tour.

## Features

- A bar on the right of the web client that pushes the screen over rather than covering
  it. Choose Visible (names), Minimized (an app icon or initials per bookmark, the name
  in a tooltip) or Hidden (a handle that opens the bar over the screen)
- Sections instead of folders: headers that split the list, with everything under them
  in view. Collapse them, reorder by drag and drop, rename inline, delete with a
  confirmation and an undo
- Three ways to bookmark the current screen: the button at the top of the bar, "Bookmark
  this page" in the command palette, or Alt+Shift+B. The new bookmark gets a name from
  the screen and its filters, ready to edit
- Bookmarks show up in the command palette's "/" search, above apps and menus, with the
  most recently opened ones on an empty search
- Every bookmark is a real link, so a middle click or Ctrl+click opens it in a new tab,
  restored the same way
- Share a bookmark with all internal users, named users or groups. Nothing appears in
  anyone's bar automatically — colleagues find it under Shared with me and choose to add
  it
- Administrators manage everyone's bookmarks under Settings, the same way they manage
  filters
