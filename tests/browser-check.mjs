#!/usr/bin/env node
// Loads one page of each type at 375px and 1280px, in light and dark, and
// fails on a console error, a failed request, horizontal overflow, or the
// wrong wordmark for the colour scheme.
import { chromium } from "playwright";
import { serve } from "./lib/serve.mjs";
import { discoverPages, representativePages } from "./lib/pages.mjs";

const publicDir = process.argv[2] || "public";
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 900 },
];
const SCHEMES = ["light", "dark"];

let fail = 0;

const pages = await discoverPages(publicDir);
const targets = representativePages(pages);

if (targets.length === 0) {
  console.log("browser-check: no pages to check yet.");
  process.exit(0);
}

const { url, close } = await serve(publicDir);
const browser = await chromium.launch();

try {
  for (const target of targets) {
    for (const viewport of VIEWPORTS) {
      for (const scheme of SCHEMES) {
        const label = `${target.url} @ ${viewport.width}px ${scheme}`;
        const context = await browser.newContext({ viewport, colorScheme: scheme });
        const page = await context.newPage();

        const consoleErrors = [];
        const failedRequests = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") consoleErrors.push(msg.text());
        });
        page.on("requestfailed", (req) => {
          failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
        });
        page.on("response", (res) => {
          if (res.status() >= 400) failedRequests.push(`${res.url()} -> ${res.status()}`);
        });

        await page.goto(url + target.url, { waitUntil: "networkidle" });

        for (const err of consoleErrors) {
          console.log(`FAILED [${label}] console error: ${err}`);
          fail = 1;
        }
        for (const req of failedRequests) {
          console.log(`FAILED [${label}] failed request: ${req}`);
          fail = 1;
        }

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        if (overflow) {
          console.log(`FAILED [${label}] horizontal overflow`);
          fail = 1;
        }

        const wordmarkSrc = await page.evaluate(() => {
          const img = document.querySelector("header img");
          return img ? img.currentSrc : null;
        });
        if (wordmarkSrc) {
          const wantsDark = scheme === "dark";
          const isReverse = /reverse-white/.test(wordmarkSrc);
          if (wantsDark !== isReverse) {
            console.log(`FAILED [${label}] wrong wordmark for colour scheme: ${wordmarkSrc}`);
            fail = 1;
          }
        }

        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  await close();
}

if (fail === 0) {
  console.log(`browser-check: ${targets.length} page type(s) x ${VIEWPORTS.length} viewport(s) x ${SCHEMES.length} scheme(s), all clean.`);
} else {
  console.log("browser-check: FAILED");
}
process.exit(fail);
