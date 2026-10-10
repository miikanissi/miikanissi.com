---
title: "Odoo development and consulting"
description:
  "Odoo migrations from 8 to 20, custom modules, and integrations with Avalara,
  TaxCloud, Shopify and HubSpot. Based in New York."
layout: services
aliases:
  - /odoo-development-services/
sitemap:
  changefreq: monthly
  priority: 0.8
cta:
  heading: "Want to talk about an Odoo problem?"
  url: "mailto:miika@miikanissi.com"
  label: "Email me"

intro:
  "Most of the work I take on is Odoo. Some of it comes from businesses directly, and
  some from Odoo partners who bring me into their team when a project gets technically
  difficult or the business requirements get complicated. Either way, I start with how
  the business works, then check how much of it standard Odoo already covers, and write
  custom code only for what's left. Every custom module is something to maintain and
  port at the next upgrade, so I'd rather write fewer of them."

stats:
  - value: "2019"
    label: "working on Odoo, starting with version 12"
  - value: "8 to 20"
    label: "the range of Odoo versions I've migrated"
  - value: "100+"
    label: "custom modules in the largest migrations"

# One H2 per service (headings carry the search phrases). Ids come from the
# title, and the homepage links to four of them, so keep those titles stable.
services:
  - title: "Odoo migrations and upgrades"
    body: |
      I've migrated databases from Odoo 8 all the way to 20. Some were simple. Others
      carried more than 100 custom modules, and each one had to be ported, replaced with
      a standard feature, or dropped.

      An upgrade starts with a review of every custom module and the data behind it, so
      the estimate covers what actually has to move. Then I run the upgrade on a copy of
      the live database as many times as it takes, and your team checks the result
      before the real switch-over.
  - title: "Custom Odoo modules"
    body: |
      New features, changes to standard behaviour, reports, and fixes to modules someone
      else wrote. I follow the OCA's coding guidelines and contribute to OCA
      repositories, so the code reads like the rest of Odoo and survives upgrades.

      I also take over custom modules written by other developers. Some need fixing, and
      some can go because a newer Odoo version does the same thing as standard.
  - title: "Integrations"
    body: |
      I've built integrations with Avalara, TaxCloud and Invoiced, and worked on others
      with Shopify, HubSpot, and freight and shipping platforms.

      ### Odoo Avalara and TaxCloud integrations

      Sales tax on quotations, orders and invoices comes from Avalara or TaxCloud, so
      nobody has to keep US tax rates up to date by hand in Odoo.

      ### Odoo Invoiced integration

      An integration I built so Odoo can hand billing over to Invoiced.

      ### Shopify, HubSpot and shipping

      I've worked on Odoo integrations with Shopify stores and HubSpot, and with freight
      and shipping platforms for manufacturers.
  - title: "AI integrations for Odoo"
    body: |
      I build AI integrations and tooling for Odoo, connecting language models to the
      data and workflows a business already has in Odoo.
  - title: "Technical lead on Odoo projects"
    body: |
      On larger projects I can lead the technical side: the architecture, the decision
      on what is configuration and what is custom code, reviews of other developers'
      work, and the upgrade path the system will have to follow later.
  - title: "Odoo system reviews"
    body: |
      When an Odoo database has become slow to change or hard to upgrade, I review the
      custom modules, configuration and data, and write up what to keep, what to fix,
      and what standard Odoo now does on its own.
  - title: "Implementation and hosting"
    body: |
      Community or Enterprise, set up to match how the business runs. I've hosted Odoo on
      Odoo.sh, CloudPepper, plain servers with Docker, and Kubernetes, and I pick the
      setup around what the business needs and what it has to work with.
  - title: "Accounting and reporting"
    body: |
      Custom accounting reports and the data work behind them, for when the standard
      reports don't answer the question your accountant is asking.

partners:
  title: "Working with Odoo partners"
  body:
    "Odoo partners bring me in for large migrations, difficult integrations, and
    business processes that standard Odoo can't handle. I work alongside their
    developers, in their codebase and by their conventions."

industries:
  title: "Industries"
  items:
    - title: "Odoo for manufacturing"
      body:
        "Freight and transport management (TMS) workflows, integrations with shipping
        platforms, and quality management."
    - title: "Odoo for private label beverage"
      body:
        "The same logistics and quality work as manufacturing, plus private label
        projects: a customer wants its own drink, and Odoo tracks the recipe, the
        artwork specs, the quality checks, and every version of each until the product
        is approved."

process:
  title: "How a project goes"
  intro:
    "Most projects follow these steps, scaled to the size of the job. When I work
    through an Odoo partner, I follow their process instead."
  steps:
    - title: "Discovery"
      body:
        "I learn how the business runs and what's already in place, from the current
        Odoo database to the spreadsheets around it."
    - title: "Scope and estimate"
      body:
        "Each requirement is matched to standard Odoo, configuration or custom code. You
        get a written scope, a plan and an estimate."
    - title: "Build"
      body:
        "Work happens in stages on a test copy, with regular demos so the people who'll
        use it can correct course early."
    - title: "Data migration and testing"
      body:
        "Data is moved over and checked, and your team tests the system against their
        real day-to-day work before anything goes live."
    - title: "Go-live"
      body: "A planned switch-over, then close support while everyone settles in."
    - title: "Support and upgrades"
      body:
        "Fixes and changes after launch, and custom modules kept ready for the next Odoo
        version."

faq:
  heading: "Questions people ask about Odoo projects"
  items:
    - q: "How long does an Odoo upgrade take?"
      a: |
        Around four weeks for a simple upgrade with few customizations, and three to six
        months for a larger migration.

        One side of the work is technical: porting the custom modules and moving the
        data. The other side is the business. Odoo changes how things work in every
        version, and an upgrade that jumps several versions brings all of those changes
        at once, so some processes will have to change with it. I go through those
        changes with the people who'll be affected, on a test copy of your database, so
        they're ready to work the new way when you go live.
    - q: "Can you upgrade a database with a lot of custom modules?"
      a: |
        Yes. The largest migrations I've done carried more than 100 custom modules. Each
        module gets one of three outcomes: ported to the new version, replaced by
        something standard Odoo now does on its own, or dropped because nobody uses it
        anymore. Fewer modules after the upgrade means less to maintain and less to port
        next time.
    - q: "Our Odoo version is out of support. Which version should we upgrade to?"
      a: |
        Usually the latest one. Odoo gives each major version three years of standard
        support, so the newest version gives you the most time before you have to
        upgrade again, and you can upgrade straight to it from an older version. Odoo 17
        left standard support in September 2026, and Odoo 16 a year before that.

        One catch: right after a new version comes out, migrating to it usually isn't
        possible for around three months. Odoo releases a new version every fall, so
        that's worth knowing when you pick a date.
    - q: "Do you work on Odoo Community or Enterprise?"
      a: |
        Both, and on every kind of hosting I've come across so far: Odoo.sh, CloudPepper,
        plain servers running Docker, and Kubernetes. My own apps on the Odoo Apps store
        run on Community and Enterprise too.
    - q: "Can an Odoo partner bring you into a project?"
      a: |
        Yes, that's a big part of what I do. Partners usually bring me in for the
        hardest part of a project: the migration with too many custom modules, the
        integration nobody on the team has built before, or the requirement standard
        Odoo doesn't cover.

        More and more, partners bring me on as the
        [technical lead and architect](#technical-lead-on-odoo-projects). I work out the
        solution with their team, guide their developers while they build it, and say
        early when standard Odoo would do the job better than custom code.
    - q: "Can you take over custom modules another developer wrote?"
      a: |
        Yes. I fix modules other developers wrote, and I'm often brought in when the
        original developer is gone. Part of the job is deciding what to keep: some
        modules need fixing, and some can go because a newer Odoo version does the same
        thing as standard.
    - q: "Can you connect Odoo to Avalara, TaxCloud or Shopify?"
      a: |
        I've built Odoo integrations with Avalara and TaxCloud for US sales tax, and with
        Invoiced for billing. I've also worked on integrations with Shopify, HubSpot, and
        freight and shipping platforms. If the system you need has an API, Odoo can
        usually be connected to it.
    - q: "Can AI tools like Claude or ChatGPT work with our Odoo data?"
      a: |
        Yes. Odoo 20 Enterprise comes with an MCP server, and connecting Claude or
        ChatGPT to it is covered in
        [my guide to connecting Claude to Odoo 20](/blog/connect-claude-to-odoo-mcp/). On
        Community or an older version there's no built-in server, so I build the
        integration. That's how my own Odoo works: it runs Community 20, and Claude looks
        up customers and invoices through Odoo's JSON-2 API.
---
