"""Create a self-contained owner preview, a root-ready Cloudflare upload ZIP and the complete editable handover."""
from pathlib import Path
import base64, json, mimetypes, re, zipfile, shutil

SITE=Path(__file__).resolve().parent
ROOT=SITE.parent
BUILT=SITE/'dist'
QA=ROOT/'quality'
PREVIEW=ROOT/'ISCA-Flora-Website.html'
TESTS=json.loads((QA/'playwright-results.json').read_text())
assert TESTS['stats']['unexpected']==0 and TESTS['stats']['expected']==96, 'Do not package a failing or incomplete test run.'

html=(BUILT/'index.html').read_text()
js_tag=re.search(r'<script\b[^>]*\bsrc="([^"]+)"[^>]*></script>',html)
css_tag=re.search(r'<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>',html)
assert js_tag and css_tag
js=(BUILT/js_tag.group(1).lstrip('/')).read_text()
css=(BUILT/css_tag.group(1).lstrip('/')).read_text()
mimes={'.woff2':'font/woff2','.md':'text/markdown;charset=utf-8','.csv':'text/csv;charset=utf-8','.mp4':'video/mp4','.pdf':'application/pdf','.webp':'image/webp','.webmanifest':'application/manifest+json'}
embedded=[]
for p in sorted((SITE/'public').rglob('*')):
    if not p.is_file() or p.suffix in ['.js','.xml','.txt']:continue
    url='/'+p.relative_to(SITE/'public').as_posix()
    # Match complete local URL literals, never a substring inside an absolute SEO URL.
    literals=[q+url+q for q in ['"',"'",'`']]
    if not any(l in html or l in js for l in literals) and url not in css:continue
    uri='data:'+mimes.get(p.suffix,mimetypes.guess_type(p.name)[0] or 'application/octet-stream')+';base64,'+base64.b64encode(p.read_bytes()).decode()
    for q in ['"',"'",'`']:
        html=html.replace(q+url+q,q+uri+q)
        js=js.replace(q+url+q,q+uri+q)
    css=css.replace(url,uri)
    embedded.append(url)
html=html.replace(js_tag.group(0),'<script>window.__ISCA_PORTABLE_PREVIEW__=true;</script><script type="module">'+js.replace('</script','<\\/script')+'</script>')
html=html.replace(css_tag.group(0),'<style>'+css+'</style>')
licences='\n\n'.join(p.read_text() for p in sorted((SITE/'public/fonts').glob('*OFL*')))
html=html.replace('</html>','<!--\nPortable owner-review preview. External links/frames need normal browser permissions. Service-worker registration is intentionally disabled here.\nEmbedded font OFL notices:\n'+licences.replace('--','—')+'\n-->\n</html>')
PREVIEW.write_text(html)

upload=ROOT/'ISCAflora-Cloudflare-Upload.zip'
with zipfile.ZipFile(upload,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in sorted(BUILT.rglob('*')):
        if p.is_file():z.write(p,p.relative_to(BUILT).as_posix())
with zipfile.ZipFile(upload) as z:
    assert z.testzip() is None and 'index.html' in z.namelist() and 'og/isca-flora-og.png' in z.namelist()
    assert len(z.namelist())<=1000 and max(i.file_size for i in z.infolist())<25*1024*1024

qa=f'''# ISCA + Flora — v2.3 quality and deployment results

**Date:** 12 October 2026. Configured target: https://iscaflora.pages.dev/. Deployment-ready, not a claim of an already-published Cloudflare domain.

## Verified production run

**{TESTS['stats']['expected']} automated checks passed: 48 desktop and 48 mobile/touch. Zero unexpected failures, skipped tests or flaky tests in the final run.**

The checks cover:

- Cinematic Learn. Grow. Become. opening: original emblem, book / atom / blossom vector graphics, logo-to-navbar transition, 2.95 s finite sequence, Skip/Escape, focus management, once-per-tab flag, replay and device reduced-motion preference.
- Hero photography updated to Celebrating the journey, together and the Education beyond the syllabus thumbnail, with gallery/video actions checked.
- Outfit and Plus Jakarta Sans variable WOFF2 fonts served locally, replacing the previous nine static font files.
- Light-only CSS/meta verified with the device set to dark, including native form fields.
- Programme keyword search, empty-result recovery/reset and source-aware Flora age guide, with boundary checks and accessibility scans.
- Mobile footer promotional copy hidden; fifth WhatsApp action follows Call us and uses the verified contact number.
- Semantic staggered headline and heading-focus / gradient-sheen effects with device reduced-motion and visible pause controls.
- All deployment/canonical/OG/Twitter/sitemap/manifest/sharing code and the rendered social card updated to https://iscaflora.pages.dev/.
- Mobile first, with unclipped hero text and no horizontal page overflow at 320, 360, 390, 480, 640, 768, 844-landscape, 900, 1024, 1280, 1440 and 1920 px.
- Phone thumb-zone controls and genuine enquiry drafts; readable 16 px form controls and safe-area-aware layout.
- Responsive menus, programme filters/details, Flora keyboard tabs, FAQs, keyboard lightbox and phone gallery scrolling / desktop bento layout.
- Programme finder routes for early years, entrance preparation, college subject support and historical English tracks; back navigation and preserved focus.
- Reduced-motion preference and visible pause/resume control.
- Native share cancellation and both denied/successful clipboard outcomes without fake success.
- Home-screen guidance and no premature installation state before the browser's appinstalled event.
- Successful local official video playback, YouTube/Maps opt-in and actual MP4 byte-range responses.
- Original enquiry validation and WhatsApp/email routing without transmitting a real outbound message.
- OG/Twitter tags in raw HTML, canonical URL, actual 1200x630 PNG, robots, sitemap, manifest and icons.
- Generated CSP / JSON-LD hash, security headers, no script/CSP errors and focus restoration.
- A real offline reload using the service worker; cached public content/images remain available, while video streams/external platforms are not cached.
- Programme PDF, research copy and media provenance download checks.
- Automated WCAG A/AA rule scans for homepage, enquiry, source/privacy dialogs, all three finder states, sharing and installation guidance. Additional programme/gallery dialog scans and visual checks are included in the evidence.

The server used the built production files and generated Cloudflare-style security headers, not just a development-only mock. External service routing is controlled in automated tests so no real enquiry is sent.

## Sharing and deployment

Target: **https://iscaflora.pages.dev/**. Public PNG: **https://iscaflora.pages.dev/og/isca-flora-og.png**.

The Cloudflare upload ZIP has `index.html` at its root, {sum(p.is_file() for p in BUILT.rglob("*"))} deployable files, no source code/raw captures/node_modules, and no file above Cloudflare's 25 MiB asset limit. PNGs and font licence notices are included. `_headers`, robots, sitemap, manifest and a versioned public-assets worker are generated by the build.

Workspace scratch captures, extraction scripts, outdated screenshots and previous font files have been cleaned up; source, uploaded logo, research and reference-only media are retained.

The social card contains the supplied ISCA logo and brand graphics, not children's faces. Social platforms can still cache previous previews; check the actual public URL after deployment.

## Remaining human/launch checks

No finite test suite guarantees zero bugs across every device. Automated scans are not an accessibility certification. Actual iPhone/Android testing, the live Cloudflare deployment and real contact applications should be checked by the owner.

Confirm programme/admissions details, age cut-offs, fees, contacts, copy and all photographer/instructor/guardian permissions before publication. The spoken reel still needs an approved verbatim subtitle track; its panel is a caption summary, not verified captions.

The enquiry flow does not save/deliver leads, take payments or confirm admissions/appointments. A real backend/CRM is a separate phase.
'''

(ROOT/'ISCA-Flora-QA-Results.md').write_text(qa)
report=json.loads((SITE/'deployment-report.json').read_text())
readme=f'''# ISCA + Flora — v2.3 light-only mobile-first handover

Configured URL: **https://iscaflora.pages.dev/**. These are deployable files, not a claim that the Cloudflare domain is already live or reserved.

## Preview

Open `ISCA-Flora-Website.html` in a normal browser. Code, CSS, fonts, authentic photos, local videos and downloads are embedded. External Maps/YouTube/contact actions require internet and normal browser permissions. Offline worker registration is intentionally disabled in this portable preview.

## Deploy

The separately supplied **ISCAflora-Cloudflare-Upload.zip** is the simplest dashboard upload; `index.html` is at its ZIP root. Alternatively, upload the **contents** of `website-static/`. Do not deploy this entire handover ZIP. Read `documents/ISCAflora-Cloudflare-Deployment-Guide.md`.

Cloudflare Git settings: Vite · `npm run build` · output `dist` · Node 22 recommended. Name `iscaflora` must be available or owned by you. If Cloudflare assigns a different hostname, edit `src/data/website.js` and rebuild before sharing.

## Source

`website-source/` is the complete editable React/Vite project.

```bash
cd website-source
npm ci
npm run dev
```

To build and verify with production security headers:

```bash
npm run build
npm run check:production
# In another terminal:
npm test
```

See the source README for exact edit points and browser installation requirements. No account credentials or backend keys are included.

## Sharing

`website-static/og/isca-flora-og.png` is the actual 1200x630 branded social image. Raw HTML supplies OG/Twitter metadata and canonical URLs; social crawlers do not need to run JavaScript. The sharing card uses the supplied original emblem and no children's faces. Social apps may cache older previews until refreshed.

## Evidence and documents

- `documents/ISCA-Flora-QA-Results.md`: **96 final browser checks passed**.
- `documents/playwright-results.json`: the machine-readable final test run.
- `documents/deployment-report.json`: {report['files']} files; largest file {report['largestFileBytes']} bytes, within dashboard limits.
- Research PDF / editable DOCX / Markdown, programme overview and media provenance remain included.
- Original-logo/media and font licences are inside source and static folders.
- `research/reference-media/` contains 18 collected reference-only assets that are **not** served on the website. Some are historical advertising; never treat them as current offers.

## Human launch checks

Approve the copy and all institution/photographer/instructor/guardian media rights. Confirm current admissions, contacts, programme availability, age cut-offs, fees, schedules and branding. Obtain approved subtitles for the spoken reel. The form prepares WhatsApp/email drafts, not stored leads, automatic applications or confirmed bookings.

Automated checks are not an absolute guarantee of no bugs on every device or an accessibility certification. Verify the actual Cloudflare domain and contact apps on real phones.
'''
archive=ROOT/'ISCA-Flora-Website-and-Research.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    base='ISCA-Flora/'
    z.writestr(base+'README.md',readme)
    z.write(PREVIEW,base+PREVIEW.name)
    for name in ['package.json','package-lock.json','vite.config.js','index.html','README.md','playwright.config.js','.gitignore','.node-version','wrangler.jsonc']:
        z.write(SITE/name,base+'website-source/'+name)
    for folder in ['src','public','scripts','tests']:
        for p in sorted((SITE/folder).rglob('*')):
            if p.is_file():z.write(p,base+'website-source/'+p.relative_to(SITE).as_posix())
    for p in sorted(BUILT.rglob('*')):
        if p.is_file():z.write(p,base+'website-static/'+p.relative_to(BUILT).as_posix())
    for p in sorted((ROOT/'research/reference-media').iterdir()):
        if p.is_file():z.write(p,base+'research/reference-media/'+p.name)
    for name in ['ISCAflora-Cloudflare-Deployment-Guide.md','ISCA-Flora-Research-and-Website-Copy.docx','ISCA-Flora-Research-and-Website-Copy.pdf','ISCA-Flora-Programme-Overview.pdf','ISCA-Flora-QA-Results.md']:
        z.write(ROOT/name,base+'documents/'+name)
    for source,name in [(ROOT/'research/ISCA-Flora-Research-and-Website-Copy.md','research-and-website-copy.md'),(ROOT/'research/media-provenance.csv','media-provenance.csv'),(QA/'playwright-results.json','playwright-results.json'),(SITE/'deployment-report.json','deployment-report.json')]:
        z.write(source,base+'documents/'+name)
    extra=QA/'visual-and-dialog-checks.json'
    if extra.exists():z.write(extra,base+'documents/visual-and-dialog-checks.json')
    for name in ['mobile-final.png','desktop-final.png','search-mobile.png','age-guide-mobile.png']:
        p=QA/name
        if p.exists():z.write(p,base+'screenshots/'+name)
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
print('Portable preview:',round(PREVIEW.stat().st_size/1024/1024,2),'MiB;',len(embedded),'embedded assets')
print('Cloudflare upload:',round(upload.stat().st_size/1024/1024,2),'MiB; index at root,',report['files'],'files')
print('Complete handover:',round(archive.stat().st_size/1024/1024,2),'MiB')
