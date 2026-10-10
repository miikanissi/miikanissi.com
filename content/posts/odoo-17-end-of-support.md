---
title: "Odoo 17 support has ended: which version to upgrade to"
description:
  "Odoo 17 left standard support in September 2026. What it means on Odoo Online,
  Odoo.sh and on-premise, which version to upgrade to, and how long it takes."
date: 2026-10-10T04:30:00-04:00
toc: True
cta:
  heading: "Want to talk about an Odoo problem?"
  url: "mailto:miika@miikanissi.com"
  label: "Email me"
---

Odoo 17's standard support ended in September 2026. A database still on 17, or on
anything older, no longer gets Odoo's regular bug fixes, security updates or helpdesk
support unless you pay for extended support, and on Odoo Online extended support doesn't
exist. What happens next depends on where your database is hosted, and the upgrade
itself depends mostly on how many custom modules you have.

## What the end of standard support means

Odoo supports every major version in two phases. Standard support covers the first three
years after release on every kind of hosting, and includes helpdesk support, bug fixes
and security updates. Extended support starts when standard support ends. It costs
extra, it's only available on Odoo.sh (for a limited number of versions) and on-premise,
and fixes are only made where they're technically feasible.

| Version   | Released       | End of standard support  |
| --------- | -------------- | ------------------------ |
| Odoo 20.0 | September 2026 | September 2029 (planned) |
| Odoo 19.0 | September 2025 | September 2028 (planned) |
| Odoo 18.0 | October 2024   | September 2027 (planned) |
| Odoo 17.0 | November 2023  | September 2026           |
| Odoo 16.0 | October 2022   | September 2025           |
| Odoo 15.0 | October 2021   | October 2024             |

The dates come from Odoo's
[standard and extended support page](https://www.odoo.com/documentation/20.0/administration/standard_extended_support.html).
If you have an Enterprise subscription, the subscription agreement is what actually
applies to you.

## What it means for your hosting

### Odoo Online

Odoo 17 is no longer supported on Odoo Online, and there's no extended support to buy.
Odoo Online makes an upgrade mandatory every two years on a major version. A few weeks
before the deadline you get a notification in your database, and if nothing is done by
the due date, Odoo runs the upgrade automatically. So the upgrade will happen either
way. What you control is the timing before the deadline and how well it's tested.

### Odoo.sh

Odoo 17 can stay on extended support for a fee. After the three years of standard
support, Odoo.sh gives you another two years to finish the upgrade, and it tells you
when an upgrade is required.

### On-premise

You can stay on 17 for as long as you like. Odoo's documentation says so while advising
against it, and extended support is available for a fee. The same page points out that
the smaller the gap between versions, the easier the upgrade, so every year you wait
makes the eventual upgrade bigger.

## Which version to upgrade to

I recommend the latest version. Every major version gets three years of standard support
from its release, so the newest one gives you the most time before you're in this
position again. Don't upgrade to 18 now: its standard support ends in September 2027,
less than a year away.

You don't have to go through every version in between. Odoo lets you upgrade from any
version straight to any major version that's still under standard support, or that left
it less than six months ago. From your side, going from 17 to 20 is one upgrade project.

One catch: right after a new version comes out, migrating to it usually isn't possible
for around three months. Odoo 20 was released in September 2026, so that window closes
around the end of the year. That's close enough that for any upgrade project starting
now, I'd go straight to 20.

Odoo's own upgrade service is only for Enterprise. Community databases are upgraded by
hand, with tools the Odoo community has built, such as the OCA's
[OpenUpgrade](https://github.com/OCA/OpenUpgrade).

## What an upgrade involves

Odoo's
[upgrade documentation](https://www.odoo.com/documentation/20.0/administration/upgrade.html)
lays out the process: request an upgraded test copy of your database, port your custom
modules to the new version, test the copy, report problems to Odoo, and upgrade the
production database once everything works.

With an Enterprise subscription, the upgrade is free for the standard apps, for
customizations made with Studio (as long as Studio and its subscription are still
active), and for custom code covered by a maintenance of customizations subscription. It
doesn't cover modules written in-house or by an Odoo partner without that subscription,
cleaning up old data and configuration, or training your team on the new version.

In my experience, that's where most of the work is: adapting the custom modules to the
new version, changing the business processes that Odoo's changes affect, and training
the people who use them.

### Custom modules

A database with custom modules can't be upgraded until those modules are available for
the version you're upgrading to. I start by reviewing every custom module and the data
behind it. Each one gets one of three outcomes: ported to the new version, replaced by
something standard Odoo now does on its own, or dropped because nobody uses it anymore.
The largest migrations I've done carried more than 100 custom modules, and fewer modules
after the upgrade means less to maintain and less to port next time.

### The business side

Odoo changes how things work in every version. An upgrade from 17 to 20 brings three
versions of those changes at once, so some of your processes will have to change with
it. Odoo's own documentation warns that going live without testing can leave users
unable to adjust to the changes, or stuck on an action they can no longer validate.

So I go through the changes with the people who'll be affected, on a test copy of your
own database, and we agree how they'll work before the switch-over. Odoo's test
checklist is a good start (reports, views, search filters, mail templates, creating and
editing records), but the real test is each team running its normal day-to-day work on
the upgraded copy.

### Your data

An upgrade moves your data to the new version, and part of the work is checking that
every record arrives exactly as it was. It doesn't fix data that was wrong to begin
with. If your data has problems in 16, it will have the same problems in 20.

It's tempting to treat a migration as a fresh start for the system, but fixing bad data
is its own project. Large cleanups that have nothing to do with the upgrade are better
handled separately, not in the middle of it.

### Test upgrades and the switch-over

The test copies Odoo gives you are neutralized: scheduled actions are switched off,
outgoing mail is disabled, payment providers and shipping carriers are set to test mode,
and bank synchronization is off. Integrations with outside systems have to be tested on
purpose, with sandbox accounts where the other side has them.

Odoo recommends requesting a fresh test upgrade now and then while you work, since both
the upgrade scripts and your database keep changing, and rehearsing the full upgrade the
day before going live. The production database is unavailable while it's being upgraded,
so plan the switch-over for a time when nobody needs it.

## How long it takes

Around four weeks for a simple upgrade with few customizations, and three to six months
for a larger migration. Most of the difference comes down to the number of custom
modules and how much the business processes have to change.

If you're on 17 or older and want a second opinion on what your upgrade involves, my
[Odoo migration and upgrade work](/services/#odoo-migrations-and-upgrades) is described
on the services page.
