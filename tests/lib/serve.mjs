// Minimal static file server for tests/*.mjs — no extra runtime dependency.
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function serve(root) {
  const server = createServer(async (req, res) => {
    let reqPath = decodeURIComponent(req.url.split("?")[0]);
    if (reqPath.endsWith("/")) reqPath += "index.html";
    let filePath = path.join(root, reqPath);
    try {
      let s = await stat(filePath);
      if (s.isDirectory()) {
        filePath = path.join(filePath, "index.html");
        s = await stat(filePath);
      }
      const ext = path.extname(filePath);
      const contentType = MIME[ext] || "application/octet-stream";
      const range = req.headers.range;

      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : s.size - 1;
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${s.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": end - start + 1,
          "Content-Type": contentType,
        });
        createReadStream(filePath, { start, end }).pipe(res);
        return;
      }

      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": s.size,
        "Accept-Ranges": "bytes",
      });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
