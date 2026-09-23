# m.nissi — [https://miikanissi.com/](https://miikanissi.com/)

Source for [miikanissi.com](https://miikanissi.com/), the landing page for Miika Nissi's
Odoo development and consulting studio (m.nissi), plus the blog. Static site, built with
[Hugo](https://gohugo.io/) — no theme submodule, no JavaScript.

## Requirements

- Hugo, **extended**, pinned version in [`.hugo-version`](.hugo-version). Install the
  standalone binary from the
  [Hugo releases page](https://github.com/gohugoio/hugo/releases) (the Debian/distro
  package is usually older) — don't rely on a system package.
- [Node.js](https://nodejs.org/) 22+, for the check suite (`npm ci` once to install).
- [lychee](https://github.com/lycheeverse/lychee) on `PATH`, for the link checks.
- [pre-commit](https://pre-commit.com/), optional but recommended: `pre-commit install`
  once per clone.

## Build

```sh
hugo --gc --minify --panicOnWarning --cleanDestinationDir   # = make build
```

Output goes to `public/`.

For local preview with live reload:

```sh
hugo server
```

## Test

`make check` runs the full suite against a fresh build: URL parity against
[`tests/baseline-urls.txt`](tests/baseline-urls.txt), internal and external link checks
(lychee), HTML validation, an axe accessibility pass in both colour schemes, the weight
budget (0 KB JS, CSS under 15 KB, homepage under 300 KB over the wire), Open
Graph/canonical tag presence, a Playwright pass over one page of each type at
375px/1280px in both colour schemes, and a Prettier format check. Only the external link
check is report-only — everything else gates.

Individual targets (`make check-html`, `make check-a11y`, `make check-budget`, etc.) are
in the [`Makefile`](Makefile); each corresponds to one row of the check table below.

| Check          | Tool                                          | Gates?      |
| -------------- | --------------------------------------------- | ----------- |
| Build          | `hugo --panicOnWarning`                       | yes         |
| URLs           | `tests/check-urls.sh`                         | yes         |
| Internal links | `lychee --offline`                            | yes         |
| External links | `lychee`                                      | report only |
| HTML           | `html-validate`                               | yes         |
| Accessibility  | `pa11y`/axe, WCAG 2.2 AA, both colour schemes | yes         |
| Weight budget  | `tests/check-budget.mjs`                      | yes         |
| Head tags      | `tests/check-head-tags.mjs`                   | yes         |
| Browser        | `tests/browser-check.mjs` (Playwright)        | yes         |
| Formatting     | Prettier (Markdown, CSS)                      | yes         |

`pre-commit run --all-files` runs a faster subset (formatting, whitespace, the build,
URLs, and internal links) suited to a pre-commit hook; CI
([`.github/workflows/check.yml`](.github/workflows/check.yml)) runs the full
`make check` on every push and PR.

## Deploy

Deploys are manual, not part of CI. From a clean checkout:

```sh
make deploy-build   # hugo --gc --minify --cleanDestinationDir, then make check
~/.local/bin/rsync_website.sh
```

`deploy-build` matters because the rsync script runs with `--delete-after`: if `public/`
isn't a clean, current build when it runs, stale files won't get removed from the
server. The deploy script itself is not part of this repo and is never run by the agent
or CI — only by hand.
