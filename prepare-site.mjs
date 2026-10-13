import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../src/data/website.js";
import { contact, social } from "../src/data/siteContent.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = site.origin.replace(/\/+$/, "");
if (!origin.startsWith("https://"))
  throw new Error("Production origin must use HTTPS.");
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
const image = `${origin}${site.socialImage}`;
const address = {
  "@type": "PostalAddress",
  streetAddress: "26 Topsia Road, beside Belal Masjid",
  addressLocality: "Kolkata",
  addressRegion: "West Bengal",
  postalCode: "700039",
  addressCountry: "IN",
};
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${origin}/#isca`,
      name: contact.name,
      alternateName: "ISCA Kolkata",
      url: `${origin}/`,
      logo: `${origin}/media/isca-logo-small.png`,
      foundingDate: "2012",
      slogan: contact.tagline,
      telephone: contact.phoneRaw,
      email: contact.email,
      address,
      geo: {
        "@type": "GeoCoordinates",
        latitude: contact.coordinates.lat,
        longitude: contact.coordinates.lng,
      },
      sameAs: [
        social.iscaInstagram,
        social.iscaKolkataInstagram,
        social.iscaFacebook,
        social.youtube,
      ],
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${origin}/#flora`,
      name: "Flora Play School",
      url: `${origin}/#flora`,
      logo: `${origin}/media/flora-logo.webp`,
      telephone: contact.phoneRaw,
      email: contact.floraEmail,
      address,
      sameAs: [social.floraInstagram, social.floraFacebook],
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: "ISCA & Flora Play School",
      description: site.description,
      inLanguage: site.language,
      publisher: { "@id": `${origin}/#isca` },
    },
    {
      "@type": "WebPage",
      "@id": `${origin}/#webpage`,
      url: `${origin}/`,
      name: site.title,
      description: site.description,
      inLanguage: site.language,
      isPartOf: { "@id": `${origin}/#website` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
      },
    },
  ],
};
const html = `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>${esc(site.title)}</title>
<meta name="description" content="${esc(site.description)}"/>
<meta name="theme-color" content="#243fc5"/>
<meta name="color-scheme" content="only light"/>
<meta name="supported-color-schemes" content="light"/>
<meta name="robots" content="index,follow,max-image-preview:large"/>
<link rel="canonical" href="${origin}/"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="ISCA &amp; Flora Play School"/>
<meta property="og:locale" content="${site.locale}"/>
<meta property="og:url" content="${origin}/"/>
<meta property="og:title" content="${esc(site.shareTitle)}"/>
<meta property="og:description" content="${esc(site.description)}"/>
<meta property="og:image" content="${image}"/>
<meta property="og:image:secure_url" content="${image}"/>
<meta property="og:image:type" content="image/png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="ISCA and Flora Play School, Kolkata. Original ISCA emblem, Education with morality, and Every learner. Every possibility."/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(site.shareTitle)}"/>
<meta name="twitter:description" content="${esc(site.description)}"/>
<meta name="twitter:image" content="${image}"/>
<meta name="twitter:image:alt" content="ISCA and Flora Play School branded sharing card with the supplied ISCA emblem"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-title" content="ISCA &amp; Flora"/>
<meta name="apple-mobile-web-app-status-bar-style" content="default"/>
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png"/>
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
<link rel="manifest" href="/site.webmanifest"/>
<link rel="preload" href="/fonts/outfit-variable.woff2" as="font" type="font/woff2" crossorigin/>
<link rel="preload" href="/fonts/plus-jakarta-sans-variable.woff2" as="font" type="font/woff2" crossorigin/>
<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>
</head>
<body>
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
<noscript><main style="font-family:system-ui;padding:32px;max-width:650px;margin:auto"><img src="/media/isca-logo-small.png" width="85" alt="Original ISCA emblem"/><h1>ISCA &amp; Flora Play School</h1><p>The Institute of Science, Commerce &amp; Arts. Education with morality, since 2012.</p><p>26 Topsia Road, beside Belal Masjid, Kolkata, West Bengal 700039.</p><p>Explore Classes VII–XII, JEE / NEET and undergraduate subject support, plus Flora’s early-years programmes. Confirm current availability and eligibility directly.</p><p>Enable JavaScript for the interactive site or contact the team: <a href="tel:${contact.phoneRaw}">${contact.phone}</a> · <a href="mailto:${contact.email}">${contact.email}</a>.</p><p>Flora: <a href="mailto:${contact.floraEmail}">${contact.floraEmail}</a></p><a href="/downloads/isca-flora-programme-overview.pdf">Download programme overview</a></main></noscript>
</body></html>`;
fs.writeFileSync(path.join(root, "index.html"), html);
fs.writeFileSync(
  path.join(root, "public/robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
fs.writeFileSync(
  path.join(root, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc><lastmod>2026-10-12</lastmod></url></urlset>\n`,
);
fs.writeFileSync(
  path.join(root, "public/site.webmanifest"),
  JSON.stringify(
    {
      id: "/",
      name: "ISCA & Flora Play School",
      short_name: "ISCA & Flora",
      description: site.description,
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "any",
      lang: site.language,
      background_color: "#fbfbf6",
      theme_color: "#243fc5",
      icons: [
        {
          src: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
    null,
    2,
  ),
);
console.log("Prepared metadata, manifest, robots and sitemap for", origin);
