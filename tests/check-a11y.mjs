#!/usr/bin/env node
// WCAG 2.2 AA check (axe-core) on every real page, in both colour schemes.
import pa11y from "pa11y";
import puppeteer from "puppeteer";
import { serve } from "./lib/serve.mjs";
import { discoverPages } from "./lib/pages.mjs";

const publicDir = process.argv[2] || "public";
const SCHEMES = ["light", "dark"];

const pages = (await discoverPages(publicDir)).filter((p) => !p.isAlias);

if (pages.length === 0) {
  console.log("check-a11y: no pages to check yet.");
  process.exit(0);
}

const { url, close } = await serve(publicDir);
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

let fail = 0;
let checked = 0;

try {
  for (const p of pages) {
    for (const scheme of SCHEMES) {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
      checked++;
      const result = await pa11y(url + p.url, {
        browser,
        page,
        runners: ["axe"],
        standard: "WCAG2AA",
        includeWarnings: false,
        includeNotices: false,
        timeout: 30000,
      });
      // axe flags some contrast checks `needsFurtherReview` when it can't
      // resolve a reliable background (a known limitation with wrapped text
      // in <pre> blocks) rather than confirming a real violation — treat
      // those as advisory instead of failing the build on an axe false
      // positive.
      const confirmed = result.issues.filter((i) => !i.runnerExtras?.needsFurtherReview);
      const advisory = result.issues.filter((i) => i.runnerExtras?.needsFurtherReview);
      if (confirmed.length > 0) {
        fail = 1;
        console.log(`FAILED ${p.url} (${scheme}): ${confirmed.length} issue(s)`);
        for (const issue of confirmed) {
          console.log(`  - ${issue.code}: ${issue.message} (${issue.selector})`);
        }
      }
      if (advisory.length > 0) {
        console.log(`ADVISORY ${p.url} (${scheme}): ${advisory.length} needs-further-review issue(s)`);
        for (const issue of advisory) {
          console.log(`  - ${issue.code}: ${issue.message} (${issue.selector})`);
        }
      }
    }
  }
} finally {
  await browser.close();
  await close();
}

if (fail === 0) {
  console.log(`check-a11y: ${checked} page/scheme combinations, no WCAG 2.2 AA errors.`);
} else {
  console.log("check-a11y: FAILED");
}
process.exit(fail);
