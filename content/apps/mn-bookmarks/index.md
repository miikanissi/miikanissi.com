---
title: "MN Bookmarks"
seo_title: "MN Bookmarks: a bookmarks bar for Odoo"
summary: "A personal bookmarks bar that reopens any backend screen as it was"
description:
  "A bookmarks bar for Odoo 20. Save any screen with its filters, grouping and view, and
  open it again in one click. Works on Community and Enterprise."
icon: "icon.svg"
price: 89.00
currency: "USD"
odoo_versions: [20]
store_url: "https://apps.odoo.com/apps/modules/mn_bookmarks"
license: "OPL-1"
fineprint:
  "Odoo 20, Community and Enterprise. Licensed under the Odoo Proprietary License v1.0
  (OPL-1)."

headline: "Your favorite Odoo screens, one click away"
lead:
  "MN Bookmarks puts a bookmarks bar next to everything you do in Odoo. Save the screen
  you're on, with its filters, grouping and view, and open it again whenever you need
  it."
pills: ["Odoo 20", "Community and Enterprise", "Desktop and mobile"]

demo:
  eyebrow: "See it in 20 seconds"
  heading: "Save a screen, go somewhere else, come straight back"
  alt:
    "Filtering the CRM pipeline, bookmarking it in one click, then reopening it from the
    bookmarks bar"

# style: "" (text left, picture right), "reverse", "wide" (text above), "even"
# (phone screenshot). Sections alternate between white and paper bands.
sections:
  - heading: "Stop rebuilding the same screen every morning"
    image: shot-bar.png
    alt:
      "The MN Bookmarks bar with Sales, Customers and Administration sections next to a
      filtered CRM list"
    body: |
      Most people open the same handful of screens every day: quotations still waiting to
      go out, this month's pipeline, customers in one region. Getting there means the same
      menu clicks and the same filters, every time.

      A bookmark remembers the whole screen, down to the pivot measures and the chart
      type. Click it and you're back where you left off.
  - heading: "Bookmark any page in one click"
    style: reverse
    image: shot-add.png
    alt:
      "A new bookmark named Pipeline · Azure, ready to rename, after clicking Add
      current page"
    body: |
      Click **Add current page** or press <kbd>Alt+Shift+B</kbd>. The bookmark names
      itself after the screen and its filters, like "Pipeline · Azure". Keep the name or
      type a better one.

      Group bookmarks into sections such as Sales or Customers, drag them into the order
      you like, and fold away the sections you don't need right now.
  - heading: "As much room as you want to give it"
    style: wide
    image: shot-modes.png
    alt: "The bookmarks bar in its Visible, Minimized and Hidden modes"
    body: |
      Keep the bar open with every name in view, shrink it to a strip of icons, or tuck it
      behind a small tab until you need it. The bar sits beside your work instead of on
      top of it, and each person picks the mode that suits them.
  - heading: "Or never touch the mouse"
    image: shot-palette.png
    alt: "Bookmarks listed at the top of the Odoo command palette"
    body: |
      Press <kbd>Ctrl+K</kbd> and type **/**. Your bookmarks come up first, above Odoo's
      apps and menus, with the ones you opened last at the top. Keep typing to narrow it
      down.

      On Enterprise you can start typing right on the home screen.
  - heading: "Share a useful screen with your team"
    style: wide
    image: shot-sharing.png
    alt:
      "Sharing a bookmark with all internal users, and a colleague's Shared with me list
      with an Add button"
    body: |
      Built a report your colleagues keep asking for? Share it with everyone, with a few
      people, or with a group. It shows up in their **Shared with me** list, where they
      can try it and add it to their own bar if they want it. Nobody's bar fills up with
      bookmarks they didn't ask for.
  - heading: "On your phone as well"
    style: even
    image: shot-mobile.png
    alt: "The bookmarks sheet open on a phone"
    body: |
      On a small screen your bookmarks are in the menu, and they open as a sheet at the
      bottom of the screen. Same sections, same bookmarks, and a button to save the page
      you're looking at.

details:
  heading: "The small things that make it pleasant"
  items:
    - title: "Opens in a new tab"
      body:
        "Every bookmark is a real link. Ctrl+click or middle-click it to open the screen
        in a new browser tab."
    - title: "Yours alone"
      body:
        "Each user has their own bar. Colleagues only see a bookmark after you share it."
    - title: "A built-in tour"
      body:
        "New users get a short guided tour and save their first bookmark along the way,
        so there's nothing to train."
    - title: "Easy to tidy up"
      body:
        "Rename sections in place and drag bookmarks between them. Deleting a section
        asks first, and you can undo it."
    - title: "Admins stay in charge"
      body:
        "Administrators can review everyone's bookmarks from Settings and set up
        bookmarks for any user."
    - title: "Light install"
      body:
        "It only needs Odoo's own web client, so it runs on Community and Enterprise
        with no extra Python packages."

faq:
  heading: "Questions people ask"
  items:
    - q: "How is this different from Odoo's saved filters (Favorites)?"
      a:
        "A favorite lives in the search menu of one screen, so you have to open that
        screen before you can use it. Bookmarks sit in one bar that follows you across
        every app, and they also remember the view you were in and the record you had
        open."
    - q: "What exactly does a bookmark remember?"
      a:
        "The app and the view (list, kanban, pivot, graph and so on), the record if you
        were on one, your filters, grouping and sort order, plus pivot measures and axes
        or the chart type and measure."
    - q: "Does it work on Odoo Community?"
      a: "Yes. It works the same on Community and Enterprise."
    - q: "If I change a bookmark I shared, does it change for my colleagues?"
      a:
        "No. When a colleague adds your bookmark, they get their own copy. Editing
        yours, un-sharing it or deleting it leaves theirs alone."
    - q: "Can I turn the bar off?"
      a:
        "Each user can switch it to Minimized or Hidden from My Preferences or from the
        menu at the top of the bar. New users start with it hidden."
---
