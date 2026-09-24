#!/usr/bin/env node
// Weight budget: 0 KB JS, one CSS file under 15 KB, homepage under 300 KB
// over the wire (fonts and photo included).
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { serve } from "./lib/serve.mjs";

const publicDir = process.argv[2] || "public";
const CSS_LIMIT = 15 * 1024;
const HOMEPAGE_LIMIT = 300 * 1024;
let fail = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const files = await walk(publicDir);

const jsFiles = files.filter((f) => f.endsWith(".js"));
if (jsFiles.length > 0) {
  console.log(`FAILED: ${jsFiles.length} .js file(s) shipped: ${jsFiles.join(", ")}`);
  fail = 1;
} else {
  console.log("check-budget: 0 KB JavaScript, ok.");
}

const cssFiles = files.filter((f) => f.endsWith(".css"));
for (const f of cssFiles) {
  const { size } = await stat(f);
  if (size > CSS_LIMIT) {
    console.log(`FAILED: ${f} is ${(size / 1024).toFixed(1)} KB, over the ${CSS_LIMIT / 1024} KB limit`);
    fail = 1;
  } else {
    console.log(`check-budget: ${f} is ${(size / 1024).toFixed(1)} KB, ok.`);
  }
}

// Homepage weight over the wire: sum actual encoded response bytes for every
// request the homepage makes (HTML, CSS, fonts, images).
const { url, close } = await serve(publicDir);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  let total = 0;
  page.on("response", async (response) => {
    try {
      const body = await response.body();
      total += body.length;
    } catch {
      // Redirects and cancelled requests have no body; ignore.
    }
  });
  await page.goto(url + "/", { waitUntil: "networkidle" });
  const kb = (total / 1024).toFixed(1);
  if (total > HOMEPAGE_LIMIT) {
    console.log(`FAILED: homepage is ${kb} KB over the wire, over the ${HOMEPAGE_LIMIT / 1024} KB limit`);
    fail = 1;
  } else {
    console.log(`check-budget: homepage is ${kb} KB over the wire, ok.`);
  }
} finally {
  await browser.close();
  await close();
}

process.exit(fail);
