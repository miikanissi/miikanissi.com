// Discovers the built HTML pages under public/ and classifies them, so the
// test scripts can tell a real page from an alias redirect stub, and pick one
// representative page per page-type for the browser check.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function walk(dir, root) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full, root)));
    } else if (entry.name.endsWith(".html")) {
      files.push("/" + path.relative(root, full).split(path.sep).join("/"));
    }
  }
  return files;
}

function urlFor(relHtmlPath) {
  // public/index.html -> /, public/about/index.html -> /about/, public/404.html -> /404.html
  if (relHtmlPath === "/index.html") return "/";
  if (relHtmlPath === "/404.html") return "/404.html";
  return relHtmlPath.replace(/index\.html$/, "");
}

function typeFor(url) {
  if (url === "/") return "home";
  if (url === "/404.html") return "404";
  if (url === "/about/") return "about";
  if (url === "/services/") return "services";
  if (url === "/apps/") return "apps-index";
  if (/^\/apps\/[^/]+\/$/.test(url)) return "app-detail";
  if (url === "/blog/") return "blog-index";
  if (/^\/blog\/[^/]+\/$/.test(url)) return "blog-post";
  return "other";
}

export async function discoverPages(publicDir) {
  const relPaths = await walk(publicDir, publicDir);
  const pages = [];
  for (const rel of relPaths) {
    const full = path.join(publicDir, rel.slice(1));
    const html = await readFile(full, "utf8");
    const isAlias = /<meta\s+http-equiv=["']refresh["']/i.test(html);
    const url = urlFor(rel);
    pages.push({ url, file: full, isAlias, type: isAlias ? "alias" : typeFor(url) });
  }
  return pages;
}

// One representative URL per real (non-alias) page type.
export function representativePages(pages) {
  const seen = new Map();
  for (const p of pages) {
    if (p.isAlias) continue;
    if (!seen.has(p.type)) seen.set(p.type, p);
  }
  return [...seen.values()];
}
