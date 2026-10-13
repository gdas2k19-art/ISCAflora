// Local production verification server, including Cloudflare's generated static headers and byte ranges.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);
const arg = process.argv.indexOf("--port");
const port = Number(
  arg >= 0 ? process.argv[arg + 1] : process.env.PORT || 3000,
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
};
const rules = [];
let current;
for (const line of fs
  .readFileSync(path.join(root, "_headers"), "utf8")
  .split("\n")) {
  if (!line.trim() || line.startsWith("#")) continue;
  if (!/^\s/.test(line)) {
    current = { pattern: line.trim(), headers: {} };
    rules.push(current);
  } else {
    const p = line.indexOf(":");
    if (p > 0)
      current.headers[line.slice(0, p).trim()] = line.slice(p + 1).trim();
  }
}
const match = (pattern, url) =>
  new RegExp(
    "^" +
      pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace("*", ".*") +
      "$",
  ).test(url);
const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://preview").pathname);
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  if (pathname === "/_headers") {
    res.writeHead(404);
    res.end();
    return;
  }
  let file = path.resolve(root, "." + pathname);
  if (pathname === "/") file = path.join(root, "index.html");
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    if (!path.extname(pathname)) {
      file = path.join(root, "index.html");
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
  }
  const size = fs.statSync(file).size;
  const headers = {
    "Content-Type": types[path.extname(file)] || "application/octet-stream",
    "Accept-Ranges": "bytes",
  };
  for (const rule of rules)
    if (match(rule.pattern, pathname)) Object.assign(headers, rule.headers);
  const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || "");
  if (range) {
    const start = Number(range[1]),
      end = Math.min(range[2] ? Number(range[2]) : size - 1, size - 1);
    if (start >= size || end < start) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` });
      res.end();
      return;
    }
    res.writeHead(206, {
      ...headers,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${size}`,
    });
    if (req.method === "HEAD") res.end();
    else fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { ...headers, "Content-Length": size });
  if (req.method === "HEAD") res.end();
  else fs.createReadStream(file).pipe(res);
});
server.listen(port, "0.0.0.0", () =>
  console.log(
    `ISCA production website on 0.0.0.0:${port} — Cloudflare headers enabled`,
  ),
);
