import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { site } from "../src/data/website.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
for (const required of [
  "og/isca-flora-og.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
])
  if (!fs.existsSync(path.join(dist, required)))
    throw new Error("Missing launch asset: " + required);
const hashes = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .filter((m) => m[1].trim())
  .map(
    (m) =>
      `'sha256-${crypto.createHash("sha256").update(m[1]).digest("base64")}'`,
  );
const csp = `default-src 'self'; script-src 'self' ${hashes.join(" ")}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; media-src 'self' data:; connect-src 'self'; frame-src https://maps.google.com https://www.google.com https://www.youtube-nocookie.com https://www.youtube.com; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`;
const headers = `# Generated for Cloudflare Pages static hosting. No Functions or account secrets required.\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n  Content-Security-Policy: ${csp}\n/\n  Cache-Control: no-cache\n/index.html\n  Cache-Control: no-cache\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/fonts/*\n  Cache-Control: public, max-age=604800\n/media/*\n  Cache-Control: public, max-age=86400\n/downloads/*\n  Cache-Control: public, max-age=3600\n/og/*\n  Cache-Control: public, max-age=3600\n/sw.js\n  Cache-Control: no-cache\n  Service-Worker-Allowed: /\n/site.webmanifest\n  Cache-Control: no-cache\n  Content-Type: application/manifest+json\n`;
if (headers.split("\n").some((line) => line.length > 2000))
  throw new Error("Cloudflare header line exceeds the supported limit.");
fs.writeFileSync(path.join(dist, "_headers"), headers);
const files = walk(dist).filter(
  (p) => !["_headers", "sw.js"].includes(path.basename(p)),
);
const digest = crypto.createHash("sha256");
for (const p of files.sort())
  digest.update(path.relative(dist, p)).update(fs.readFileSync(p));
const version = digest.digest("hex").slice(0, 16);
const precache = files
  .filter(
    (p) =>
      !p.endsWith(".mp4") &&
      !p.endsWith("isca-logo.png") &&
      !p.endsWith(".txt"),
  )
  .map((p) => "/" + path.relative(dist, p).split(path.sep).join("/"));
precache.push("/");
const worker = `/* ISCA public-assets offline cache. Visitor form values, external requests and videos are never stored. */\nconst CACHE='isca-public-${version}';\nconst FILES=${JSON.stringify(precache)};\nself.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));\nself.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('isca-public-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));\nself.addEventListener('fetch',event=>{\n const request=event.request,url=new URL(request.url);\n if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.endsWith('.mp4')||request.headers.has('range'))return;\n if(request.mode==='navigate'){event.respondWith(fetch(request).catch(()=>caches.match('/index.html').then(r=>r||Response.error())));return;}\n if(!FILES.includes(url.pathname))return;\n event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(request,{ignoreSearch:true});if(cached)return cached;const response=await fetch(request);if(response.ok)cache.put(request,response.clone());return response;}));\n});\n`;
fs.writeFileSync(path.join(dist, "sw.js"), worker);
const maximum = 25 * 1024 * 1024;
for (const p of walk(dist))
  if (fs.statSync(p).size > maximum)
    throw new Error(`File exceeds Cloudflare Pages 25 MiB limit: ${p}`);
if (walk(dist).length > 1000)
  throw new Error(
    "Dashboard upload exceeds 1,000 files. Use Wrangler instead.",
  );
fs.writeFileSync(
  path.join(root, "deployment-report.json"),
  JSON.stringify(
    {
      site: site.origin,
      project: site.projectName,
      files: walk(dist).length,
      largestFileBytes: Math.max(...walk(dist).map((p) => fs.statSync(p).size)),
      build: version,
      ogImage: site.origin + site.socialImage,
      cacheExcludes: [
        "visitor form values",
        "all video streams",
        "external platforms",
      ],
      generatedHeaders: true,
    },
    null,
    2,
  ),
);
console.log(
  "Cloudflare-ready:",
  walk(dist).length,
  "files, build",
  version,
  "with CSP and public-assets offline support.",
);
