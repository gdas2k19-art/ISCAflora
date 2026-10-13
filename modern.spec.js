import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import crypto from "node:crypto";

const violations = async (page) =>
  (
    await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze()
  ).violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }));
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("phone layouts work from 320px and in landscape without hiding content", async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 740],
    [360, 800],
    [390, 844],
    [480, 900],
    [640, 900],
    [768, 1024],
    [844, 390],
    [900, 1000],
    [1024, 900],
    [1280, 900],
    [1440, 1000],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    const sizes = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      viewport: innerWidth,
      heading: document.querySelector(".hero-accent").getBoundingClientRect()
        .right,
    }));
    expect(sizes.doc, `document at ${width}x${height}`).toBeLessThanOrEqual(
      sizes.viewport,
    );
    expect(
      sizes.heading,
      `unclipped hero text at ${width}px`,
    ).toBeLessThanOrEqual(sizes.viewport);
  }
});

test("thumb-zone enquiry opens a real draft flow on phones", async ({
  page,
}, info) => {
  if (info.project.name !== "Mobile") {
    await expect(page.locator(".mobile-dock")).toBeHidden();
    return;
  }
  const dock = page.getByRole("group", { name: "Mobile quick actions" });
  await expect(dock).toBeVisible();
  for (const el of await dock.locator("a,button").all()) {
    const r = await el.boundingBox();
    expect(r.height).toBeGreaterThanOrEqual(44);
  }
  await expect(
    dock.getByRole("link", { name: "Call us", exact: true }),
  ).toHaveAttribute("href", "tel:+917003561315");
  await dock.getByRole("button", { name: "Enquire", exact: true }).click();
  await expect(page.getByLabel("Your name")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    dock.getByRole("button", { name: "Enquire", exact: true }),
  ).toBeFocused();
});

test("gallery uses real horizontal scrolling on mobile and a bento on desktop", async ({
  page,
}, info) => {
  await page.locator("#life").scrollIntoViewIfNeeded();
  const grid = page.locator(".gallery-grid");
  if (info.project.name === "Mobile") {
    expect(
      await grid.evaluate((e) => e.scrollWidth > e.clientWidth),
    ).toBeTruthy();
    await page.getByRole("button", { name: "Scroll gallery right" }).click();
    await expect
      .poll(() => grid.evaluate((e) => e.scrollLeft))
      .toBeGreaterThan(50);
    await expect(page.locator(".gallery-position")).not.toHaveText("1 / 4");
  } else {
    const a = await grid.locator(".gallery-item").first().boundingBox();
    const b = await grid.locator(".gallery-item").nth(1).boundingBox();
    expect(a.width).toBeGreaterThan(b.width);
    await expect(page.locator(".gallery-mobile-toolbar")).toBeHidden();
  }
});

for (const [audience, goal, title, field] of [
  [
    "A little learner",
    "Montessori 2 · 3.5–4.5 years",
    "Little learners, big wonder",
    "Flora Play School",
  ],
  [
    "An entrance aspirant",
    "NEET preparation",
    "Bigger ambitions",
    "Bigger ambitions",
  ],
  [
    "A college learner",
    "B.A subject support",
    "Your next chapter",
    "Your next chapter",
  ],
  ["A skills explorer", "Spoken English", "Find your voice", "Find your voice"],
]) {
  test(`path finder safely routes ${audience.toLowerCase()} to the right enquiry`, async ({
    page,
  }) => {
    await page.locator(".hero-finder-link").click();
    await page.getByRole("button", { name: new RegExp(audience) }).click();
    await page.getByRole("button", { name: goal, exact: true }).click();
    await expect(page.locator(".finder-result")).toContainText(title);
    await expect(page.locator(".finder-disclaimer")).toContainText(
      "not an admission",
    );
    await page
      .getByRole("button", { name: "Talk about this pathway", exact: true })
      .click();
    await expect(page.getByLabel("I’m interested in")).toHaveValue(field);
    await expect(page.getByLabel(/Anything you’d like/)).toHaveValue(
      new RegExp(goal.split(" · ")[0].toLowerCase()),
    );
  });
}

test("finder back navigation, keyboard focus and rule scans are correct", async ({
  page,
}) => {
  await page.locator(".hero-finder-link").click();
  expect(await violations(page)).toEqual([]);
  await page.getByRole("button", { name: /A school student/ }).click();
  await expect(page.locator(".finder-content>h3")).toBeFocused();
  expect(await violations(page)).toEqual([]);
  await page
    .getByRole("button", { name: "Science subject support", exact: true })
    .click();
  expect(await violations(page)).toEqual([]);
  await page.getByRole("button", { name: "Back one step" }).click();
  await expect(
    page.getByRole("button", { name: "Arts subject support", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back one step" }).click();
  await expect(
    page.getByRole("button", { name: /A little learner/ }),
  ).toBeVisible();
});

test("animations can be paused and follow device motion preference", async ({
  page,
}) => {
  await expect(page.locator(".motion-button")).toBeDisabled();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(
    page.getByRole("button", { name: "Pause animations", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Pause animations", exact: true })
    .click();
  await expect(page.locator("html")).toHaveClass(/motion-paused/);
  expect(
    await page
      .locator(".learning-rail>div")
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
  await page
    .getByRole("button", { name: "Resume animations", exact: true })
    .click();
  await expect(page.locator("html")).not.toHaveClass(/motion-paused/);
  expect(
    await page
      .locator(".learning-rail>div")
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toContain("rail-slide");
});

test("share uses the approved canonical URL and handles clipboard denial honestly", async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("restricted");
        },
      },
      configurable: true,
    });
  });
  await page
    .getByRole("button", { name: "Share website", exact: true })
    .click();
  await expect(page.getByLabel("Website link to share")).toHaveValue(
    "https://iscaflora.pages.dev/",
  );
  await expect(page.locator(".share-card-preview")).toBeVisible();
  expect(await violations(page)).toEqual([]);
  await page
    .getByRole("button", { name: "Copy website link", exact: true })
    .click();
  await expect(page.locator(".share-status")).toContainText(
    "Copying is restricted",
  );
  await expect(page.getByLabel("Website link to share")).toBeFocused();
});

test("share copy success and native share cancellation have truthful states", async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text) => {
          window.__copied = text;
        },
      },
      configurable: true,
    });
  });
  await page
    .getByRole("button", { name: "Share website", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Copy website link", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Link copied", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.__copied)).toBe(
    "https://iscaflora.pages.dev/",
  );
  await page.keyboard.press("Escape");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: async () => {
        const e = new Error("cancel");
        e.name = "AbortError";
        throw e;
      },
      configurable: true,
    }),
  );
  await page
    .getByRole("button", { name: "Share website", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("home-screen guidance is accessible and does not pretend an installation happened", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Add to home screen", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Safari");
  await expect(page.getByRole("dialog")).toContainText("deployed HTTPS");
  expect(await violations(page)).toEqual([]);
});

test("accepted install prompt is not marked installed until appinstalled", async ({
  page,
}) => {
  await page.evaluate(() => {
    const e = new Event("beforeinstallprompt");
    e.prompt = async () => {};
    e.userChoice = Promise.resolve({ outcome: "accepted" });
    window.dispatchEvent(e);
  });
  await page
    .getByRole("button", { name: "Add to home screen", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Add to home screen", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
  await expect(
    page.getByRole("button", { name: "Shortcut installed", exact: true }),
  ).toBeDisabled();
});

test("raw HTML exposes complete OG and Twitter tags without needing JavaScript", async ({
  request,
}) => {
  const r = await request.get("/");
  const html = await r.text();
  expect(html).toContain("https://iscaflora.pages.dev/");
  expect(html).not.toContain("thetoddlerhouse");
  for (const p of [
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:image:secure_url",
    "og:image:width",
    "og:image:height",
    "og:image:alt",
    "og:site_name",
    "og:locale",
  ])
    expect(html).toContain(`property="${p}"`);
  expect(html).toContain('name="twitter:card" content="summary_large_image"');
  expect(html).toContain('rel="canonical"');
  const img = await request.get("/og/isca-flora-og.png");
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toContain("image/png");
  const body = await img.body();
  expect(body.readUInt32BE(16)).toBe(1200);
  expect(body.readUInt32BE(20)).toBe(630);
});

test("security headers, byte ranges, robots, sitemap and manifest are deployable", async ({
  request,
}) => {
  const r = await request.get("/");
  expect(r.headers()["x-content-type-options"]).toBe("nosniff");
  expect(r.headers()["content-security-policy"]).toContain("script-src 'self'");
  const html = await r.text();
  const text = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(
    html,
  )[1];
  const hash = crypto.createHash("sha256").update(text).digest("base64");
  expect(r.headers()["content-security-policy"]).toContain(hash);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Allow: /");
  expect(await robots.text()).toContain(
    "https://iscaflora.pages.dev/sitemap.xml",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain(
    "<loc>https://iscaflora.pages.dev/</loc>",
  );
  const manifest = await (await request.get("/site.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons).toHaveLength(2);
  for (const icon of manifest.icons)
    expect((await request.get(icon.src)).status()).toBe(200);
  const clip = await request.get("/media/annual-function-2026.mp4", {
    headers: { Range: "bytes=0-1023" },
  });
  expect(clip.status()).toBe(206);
  expect((await clip.body()).length).toBe(1024);
});

test("production runs without script or CSP errors and preserves keyboard modal focus", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.reload();
  await page.locator(".hero-main-photo").click();
  const next = page.getByRole("button", { name: "Next gallery image" });
  await next.focus();
  await next.press("Enter");
  await expect(next).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".hero-main-photo")).toBeFocused();
  expect(errors).toEqual([]);
});

test("public offline shell really works and never caches video or external services", async ({
  browser,
  baseURL,
}) => {
  const c = await browser.newContext({
    serviceWorkers: "allow",
    reducedMotion: "reduce",
  });
  try {
    const p = await c.newPage();
    await p.goto(baseURL);
    await p.waitForFunction(() => !!navigator.serviceWorker.controller, {
      timeout: 15000,
    });
    const stored = await p.evaluate(async () => {
      const keys = await caches.keys();
      const c = await caches.open(
        keys.find((k) => k.startsWith("isca-public-")),
      );
      return (await c.keys()).map((r) => r.url);
    });
    expect(stored.some((u) => u.endsWith(".mp4"))).toBeFalsy();
    expect(
      stored.every((u) => new URL(u).origin === locationOrigin(baseURL)),
    ).toBeTruthy();
    await c.setOffline(true);
    await p.reload();
    await expect(p.getByRole("heading", { level: 1 })).toContainText(
      "Better futures.",
    );
    await expect(p.locator(".offline-banner")).toBeVisible();
    expect(
      await p
        .locator(".hero-main-photo img")
        .evaluate((i) => i.complete && i.naturalWidth > 0),
    ).toBeTruthy();
  } finally {
    await c.close();
  }
});
function locationOrigin(url) {
  return new URL(url).origin;
}

test("home-screen promotional copy is hidden on phones and retained on desktop", async ({
  page,
}, info) => {
  const copy = page.locator(".app-tools-copy");
  if (info.project.name === "Mobile") await expect(copy).toBeHidden();
  else await expect(copy).toBeVisible();
});

test("mobile WhatsApp action follows Call us and uses the verified school number", async ({
  page,
}, info) => {
  if (info.project.name !== "Mobile") {
    await expect(page.locator(".mobile-dock")).toBeHidden();
    return;
  }
  const dock = page.getByRole("group", { name: "Mobile quick actions" });
  const actions = dock.locator("a,button");
  await expect(actions).toHaveCount(5);
  await expect(actions.nth(3)).toContainText("Call us");
  await expect(actions.nth(4)).toContainText("WhatsApp");
  await expect(actions.nth(4)).toHaveAttribute(
    "href",
    /^https:\/\/wa.me\/917003561315\?text=/,
  );
  await expect(actions.nth(4)).toHaveAttribute("rel", /noopener/);
  for (const el of await actions.all()) {
    const r = await el.boundingBox();
    expect(r.height).toBeGreaterThanOrEqual(44);
    expect(r.width).toBeGreaterThanOrEqual(44);
  }
});

test("animated hero text remains semantic and supports motion controls", async ({
  page,
}) => {
  await expect(page.locator(".hero-word-text")).toHaveCount(3);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Big dreams.",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Bright minds.",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Better futures.",
  );
  expect(
    await page
      .locator(".hero-word-text")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(
    page.getByRole("button", { name: "Pause animations", exact: true }),
  ).toBeEnabled();
  expect(
    await page
      .locator(".hero-word-text")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toContain("word-rise");
  await page
    .getByRole("button", { name: "Pause animations", exact: true })
    .click();
  expect(
    await page
      .locator(".hero-word-text")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
});
