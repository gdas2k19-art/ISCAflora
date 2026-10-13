// Optional authoring utility. Already-rendered PNGs are committed; Cloudflare builds do not need a browser.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { site } from "../src/data/website.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = (file, mime) =>
  `data:${mime};base64,${fs.readFileSync(path.join(root, "public", file)).toString("base64")}`;
const fonts = `@font-face{font-family:Outfit;font-weight:800;src:url(${data("fonts/outfit-variable.woff2", "font/woff2")})}@font-face{font-family:DM;src:url(${data("fonts/plus-jakarta-sans-variable.woff2", "font/woff2")})}@font-face{font-family:DM;font-weight:700;src:url(${data("fonts/plus-jakarta-sans-variable.woff2", "font/woff2")})}`;
const domain = new URL(site.origin).hostname;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;background:#233ec4;color:white;font-family:DM,sans-serif}.card{position:relative;width:1200px;height:630px;background:radial-gradient(ellipse at 100% 30%,#4164e8 0,transparent 56%),linear-gradient(135deg,#172c9a,#243fc5 56%,#263ebe);padding:58px 65px;isolation:isolate}.grid{position:absolute;inset:0;background-image:radial-gradient(#ffffff18 1px,transparent 1px);background-size:24px 24px;mask-image:linear-gradient(100deg,transparent,black);z-index:-1}.halo{position:absolute;width:520px;height:520px;border:1px solid #ffffff1f;border-radius:50%;right:-105px;top:-70px;z-index:-1}.halo:after{content:'';position:absolute;inset:40px;border:1px solid #ffffff15;border-radius:50%}.brand{display:flex;align-items:center;gap:14px}.brand span{font:800 53px/1 Outfit;letter-spacing:-3px}.brand i{display:inline-block;width:10px;height:10px;border-radius:50%;background:#ee6959;margin-left:4px}.brand p{margin:0;font:400 16px/1.5 DM;color:#dfe7ff;border-left:1px solid #b6c7ff7d;padding-left:18px}.label{margin-top:43px;display:inline-flex;gap:10px;align-items:center;color:#e1eaff;font-size:13px;font-weight:700;letter-spacing:2px}.label:before{content:'';width:7px;height:7px;background:#f5d963;border-radius:50%}h1{font:800 76px/1.07 Outfit;letter-spacing:-4.3px;margin:20px 0 25px;position:relative;max-width:730px}h1 span{color:#ffe079}.underline{position:absolute;left:0;bottom:-18px;width:617px;height:20px}.family{display:flex;align-items:center;gap:14px;margin-top:33px;font-size:17px;color:#e5ecff}.flora{background:#e7f2d9;color:#245a3e;font-weight:700;display:inline-flex;align-items:center;gap:9px;padding:11px 17px;border:1px solid #d1e3bb;border-radius:100px}.flora b{font-size:23px;line-height:1;color:#288664}.crest{position:absolute;right:70px;top:139px;width:254px;height:270px;padding:27px 29px 24px;background:#fffef7;border:7px solid #ffffff3b;border-radius:28px;transform:rotate(3deg);box-shadow:0 24px 45px #0b155040}.crest img{display:block;width:100%;height:100%;object-fit:contain}.crest-tag{position:absolute;right:45px;top:416px;display:flex;align-items:center;gap:10px;background:#183831;color:#eaf5d6;padding:11px 21px;border-radius:15px;border:1px solid #91bb8780;transform:rotate(-3deg);font-size:15px;font-weight:700;box-shadow:0 10px 25px #1421301c}.crest-tag:before{content:'';width:7px;height:7px;background:#f9dc6c;border-radius:50%}.star{position:absolute;right:45px;top:95px;width:77px;height:77px;color:#f6d963;transform:rotate(-5deg)}.scribble{position:absolute;right:37px;top:475px;width:100px;height:52px;color:#ef7866}.bottom{position:absolute;left:65px;right:65px;bottom:37px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #ffffff31;padding-top:19px;font-size:15px;color:#dce6ff}.bottom strong{font-weight:700;font-size:17px;color:white}.corner{position:absolute;left:-85px;bottom:-158px;width:335px;height:260px;border:1px solid #ffffff1a;border-radius:50%;z-index:-1}</style></head><body><div class="card"><div class="grid"></div><div class="halo"></div><div class="corner"></div><div class="brand"><span>ISCA<i></i></span><p>The Institute of Science,<br>Commerce &amp; Arts</p></div><div class="label">TOPSIA, KOLKATA · SINCE 2012</div><h1>Every learner.<br><span>Every possibility.</span><svg class="underline" viewBox="0 0 625 25" preserveAspectRatio="none"><path d="M3 15C143 0 432 4 620 12M82 23c156-10 334-7 481-3" fill="none" stroke="#f9dc6c" stroke-width="4" stroke-linecap="round"/></svg></h1><div class="family"><span>School learning &amp; bigger ambitions</span><span class="flora"><b>✿</b>Flora Play School</span></div><div class="crest"><img src="${data("media/isca-logo.png", "image/png")}" alt="Supplied original ISCA emblem"></div><div class="crest-tag">Education with morality.</div><svg class="star" viewBox="0 0 100 100"><path fill="currentColor" d="M50 0 59 32 83 17 68 41 100 50 68 59 83 83 59 68 50 100 41 68 17 83 32 59 0 50 32 41 17 17 41 32Z"/></svg><svg class="scribble" viewBox="0 0 120 70"><path d="M5 42c24 34 40-32 62-13s36 22 46-6m-13 1 13-1-2 13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><div class="bottom"><span>26 Topsia Road · Kolkata · ISCA &amp; Flora</span><strong>${domain}</strong></div></div></body></html>`;
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(root, "public", site.socialImage),
    type: "png",
  });
  console.log("Created 1200 × 630 social card:", site.socialImage);
} finally {
  await browser.close();
}
