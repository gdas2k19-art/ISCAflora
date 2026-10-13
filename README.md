# ISCA + Flora — mobile-first, Cloudflare-ready website

**Public URL configured:** https://iscaflora.pages.dev/  
**Version:** 2.3.0  
**Status:** working, research-informed website and deployable static build. This does not claim the domain has already been deployed or reserved in your Cloudflare account.

Uses the supplied original ISCA emblem, its theme colours and authentic institution imagery. No stock school photographs, fabricated testimonials, staff biographies, results, affiliation or fee claims.

## Run locally

Node 22 is recommended. Node 20.19+ on the 20 LTS line also works.

```bash
npm ci
npm run dev
```

The developer server binds to `0.0.0.0:3000` and permits the Arena preview host. No browser-facing code calls localhost APIs. All app assets are local; external players and Maps require opt-in.

## Build and preview production

```bash
npm run build
npm run check:production
```

The production verification server includes the generated Cloudflare static headers and supports video byte ranges. `npm run preview` is also available, but Vite's preview does not apply Cloudflare `_headers` itself.

## Deploy on Cloudflare Pages

Deploy the contents of the generated **`dist`** folder. The separate **ISCAflora-Cloudflare-Upload.zip** already contains those files, with `index.html` at the ZIP root; upload it using Cloudflare Pages Direct Upload / drag and drop.

For Git integration:

- Framework: **Vite**
- Build command: **`npm run build`**
- Output: **`dist`**
- Node: **22**, supplied in `.node-version`
- Project: **`iscaflora`**, if available or already owned by you

For local CLI deployment, authenticate in your own browser:

```bash
npx wrangler login
# Only if you need to create a new project:
npx wrangler pages project create iscaflora --production-branch main
npm run deploy
```

Do not put account tokens into the website. The full handover includes a step-by-step Cloudflare deployment guide. Name availability/ownership is not verified here; if the assigned host differs, update `src/data/website.js` and rebuild before sharing.

## Editing

- Public URL and SEO / social copy: `src/data/website.js`
- Verified programme facts, sources and contacts: `src/data/siteContent.js`
- Main layout/components: `src/App.jsx`
- Programme finder, motion, sharing and home-screen tools: `src/ModernFeatures.jsx`
- Opening animation and its SVG/CSS art: `src/OpeningExperience.jsx` / `.css`
- Phone-first design, effects, progressive grids: `src/styles.css`
- Photos/clips/original emblem: `public/media/`
- Local WOFF2 fonts and OFL notices: `public/fonts/`
- OG sharing PNG: `public/og/isca-flora-og.png`
- Favicon and home-screen icons: `public/icons/`
- Brochure/research/provenance: `public/downloads/`

The build generates `index.html`, `robots.txt`, `sitemap.xml`, the manifest, hashed CSP headers and a versioned public-assets service worker. Edit the data/config instead of editing those generated files by hand.

The social PNG is pre-rendered, so Cloudflare does not need Chromium. To redraw it after changing branding/domain copy, optionally run `node scripts/render-social-card.mjs` locally after installing the Playwright browser. The original supplied emblem remains unchanged.

## Mobile-first / modern features

- A 2.95-second logo-led opening: drawn book/science/blossom graphics, brand-word reveal, logo-to-navbar transition, Skip/Escape, replay and automatic reduced-motion bypass. A non-personal session flag prevents repeating it in the same tab. No artificial loading percentages or external assets.
- Comfortable phone text, safe-area-aware bottom actions and large tap targets.
- Phone scroll-snap gallery; desktop bento grid; keyboard and touch lightbox navigation.
- Three-step, source-aware programme finder with prefilled enquiry context.
- Scroll reveals, hand-drawn accent animation, floating geometry, hover effects and reading progress.
- Visible animation pause control and device reduced-motion support.
- Native sharing when available, honest copy-link fallback.
- Home-screen installation guidance / native prompt when supported.
- Public pages, photographs and programme document cached for offline access after a complete first load; no enquiry data/video/external services cached.
- Accessible programme details, Flora tabs, FAQs, source notes, privacy notes and validated WhatsApp/email drafts.
- Opt-in Google Maps and official YouTube playback.

## Enquiry behaviour

The form prepares a message. It does **not** automatically send it, store leads, charge fees, decide admission or confirm bookings. The visitor sends it through WhatsApp/email. There is no CRM or delivery backend. Copy, sharing and installation show success only when their browser APIs acknowledge it; denied/cancelled actions have honest fallbacks.

## Permissions and launch checks

Public visibility is not a reuse licence. Confirm institution/photographer/instructor/guardian consent before public use of school media, including the Google Maps photo and all identifiable minors. The annual and archived Flora clips have third-party music removed. The instructor reel currently has a summary of the published caption, not approved verbatim captions. Obtain subtitles before making an accessibility-compliance claim.

Confirm contacts, current batches/fees, Flora age cut-offs, physical facilities, branding and final copy. Board names describe tuition support, not affiliation. B.Com/B.A is subject support, not degree awards. Historical promotions are not current fees.

Instagram public automated access was blocked; official links are included without bypassing private/login-gated media. Sources and media provenance remain in the research handover.

## Repeat the tests

Build and start the production verification server before running the suite:

```bash
npx playwright install chromium
# On Linux, if browser dependencies are missing:
npx playwright install-deps chromium
npm run build
npm run check:production
# In another terminal:
npm test
```

The suite covers desktop and touch/mobile contexts, 320–1920 px widths and landscape, existing interactions, programme finder, sharing/clipboard errors, truthful install states, device/motion controls, actual offline reload, metadata, security headers, video ranges, downloads and automated accessibility rules. Tests use controlled external routing, not real outbound enquiries.

No finite test suite is an absolute guarantee of no bugs on every browser. Real-device testing and checking the actual Cloudflare deployment are recommended. Test evidence is in the full handover package.

## Review the opening after it has played

Use the **Watch the welcome** action on the homepage or **Replay opening** in the footer. You can also open `https://iscaflora.pages.dev/?intro=1` after deployment to request the opening explicitly. Reduced-motion preference is still respected.

## Latest mobile and text updates

The home-screen promotional heading/description is hidden below the desktop breakpoint. The mobile dock has Explore, Flora, Enquire, Call us, then WhatsApp. The WhatsApp link uses the institution’s published number. Hero lines reveal after the opening; headings have short focus reveals and a gentle accent sheen. All text stays present for assistive technology and follows the pause/reduced-motion preference. The new production target and Cloudflare project are `https://iscaflora.pages.dev/` and `iscaflora`.

## Light-only refinement release

Hero photography now uses the requested annual-function student group image and official syllabus-message thumbnail. The small thumbnail plays the corresponding institute video; the large photo opens its matching gallery entry. Fonts are self-hosted variable Outfit (headings) and Plus Jakarta Sans (body), with their OFL notices. CSS and metadata opt out of device/browser dark theme; deliberate royal-blue/navy brand sections remain part of the same light design.

Programme search works with category filters and includes an empty-state reset. Flora’s age guide uses published bands and does not decide eligibility; no name, birth date or entered age is saved. The current workspace retains final files and evidence in `quality/` rather than scratch scraping/inspection folders.
