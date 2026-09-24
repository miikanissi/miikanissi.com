#!/usr/bin/env node
// Every real (non-alias) page must carry og:title, og:description, og:image
// and a canonical link, so link previews and search results work.
import { discoverPages } from "./lib/pages.mjs";

const publicDir = process.argv[2] || "public";
// Minified HTML drops quotes on simple attribute values, so match both
// quoted and unquoted forms.
const REQUIRED = [
  { name: "og:title", re: /<meta[^>]+property=["']?og:title["' >]/i },
  { name: "og:description", re: /<meta[^>]+property=["']?og:description["' >]/i },
  { name: "og:image", re: /<meta[^>]+property=["']?og:image["' >]/i },
  { name: "canonical link", re: /<link[^>]+rel=["']?canonical["' >]/i },
];

const { readFile } = await import("node:fs/promises");

const pages = await discoverPages(publicDir);
let fail = 0;
let checked = 0;

for (const page of pages) {
  if (page.isAlias) continue;
  checked++;
  const html = await readFile(page.file, "utf8");
  for (const req of REQUIRED) {
    if (!req.re.test(html)) {
      console.log(`MISSING ${req.name}: ${page.url}`);
      fail = 1;
    }
  }
}

if (fail === 0) {
  console.log(`check-head-tags: ${checked} pages all have og:title, og:description, og:image and a canonical link.`);
} else {
  console.log("check-head-tags: FAILED");
}
process.exit(fail);
