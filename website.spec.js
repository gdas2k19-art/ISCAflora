import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("home loads, authentic assets render, and no third-party embeds load initially", async ({
  page,
}) => {
  await expect(page).toHaveTitle(/ISCA Kolkata & Flora Play School/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Better futures.",
  );
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator(".hero-main-photo img")).toBeVisible();
  expect(
    await page
      .locator(".hero-main-photo img")
      .evaluate((i) => i.complete && i.naturalWidth > 0),
  ).toBeTruthy();
  await expect(page.locator(".programme-card")).toHaveCount(6);
});

test("programme filters and detail-to-enquiry flow work", async ({ page }) => {
  const filters = page.getByRole("group", { name: "Filter programmes" });
  await filters
    .getByRole("button", { name: "Early years", exact: true })
    .click();
  await expect(page.locator(".programme-card")).toHaveCount(1);
  await expect(page.locator(".programme-card")).toContainText(
    "Little learners",
  );
  await filters
    .getByRole("button", { name: "School & college", exact: true })
    .click();
  await expect(page.locator(".programme-card")).toHaveCount(2);
  await page
    .locator(".programme-card")
    .first()
    .getByRole("button", { name: "Explore programme" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "not claims of board affiliation",
  );
  await page
    .getByRole("button", { name: "Request a demo class", exact: true })
    .click();
  await expect(page.getByLabel("I’m interested in")).toHaveValue(
    "School learning",
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  await filters
    .getByRole("button", { name: "Life skills", exact: true })
    .click();
  await expect(page.locator(".programme-card")).toHaveCount(2);
});

test("Flora stages are clickable and keyboard navigable", async ({ page }) => {
  await page.locator("#flora").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: "L.K.G", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("4.5–5.5 years");
  await page
    .getByRole("tab", { name: "L.K.G", exact: true })
    .press("ArrowLeft");
  await expect(
    page.getByRole("tab", { name: "Montessori 2", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("3.5–4.5 years");
  await page
    .getByRole("tab", { name: "Montessori 2", exact: true })
    .press("Home");
  await expect(page.getByRole("tabpanel")).toContainText("2.5–3.5 years");
});

test("gallery filters, captions, arrow navigation and escape work", async ({
  page,
}) => {
  const filters = page.getByRole("group", { name: "Filter photo gallery" });
  await filters.getByRole("button", { name: "Flora", exact: true }).click();
  await expect(page.locator(".gallery-item")).toHaveCount(1);
  await page.locator(".gallery-item").click();
  await expect(page.getByRole("dialog")).toContainText(
    "Flora Play School’s performance",
  );
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog")).toContainText(
    "ISCA Google Maps listing",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
});

test("FAQ expands and closes without implying current promotional fees", async ({
  page,
}) => {
  const q = page.getByRole("button", {
    name: /Where can I find the current fees and timetable/,
  });
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-4")).toContainText(
    "no old promotional price",
  );
  await q.click();
  await expect(page.locator("#faq-4")).toBeHidden();
});

test("enquiry validates and prepares WhatsApp without transmitting", async ({
  page,
}) => {
  await page.locator(".nav-enquire").click();
  await page.getByLabel("Your name", { exact: true }).fill("A");
  await page.getByLabel("Contact number", { exact: true }).fill("9876543210");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Continue to WhatsApp", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("at least two");
  await page.getByLabel("Your name", { exact: true }).fill("Test Enquiry");
  await page.getByLabel("Contact number", { exact: true }).fill("123");
  await page
    .getByRole("button", { name: "Continue to WhatsApp", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("valid contact number");
  await page
    .getByLabel("Contact number", { exact: true })
    .fill("+91 98765 43210");
  await page.getByLabel("I’m interested in").selectOption("Flora Play School");
  await page.evaluate(() => {
    window.open = (url) => {
      window.__preparedUrl = url;
      return null;
    };
  });
  await page
    .getByRole("button", { name: "Continue to WhatsApp", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("not sent yet");
  const url = await page.evaluate(() => window.__preparedUrl);
  expect(url).toContain("https://wa.me/917003561315");
  expect(decodeURIComponent(url)).toContain("Hello Flora Play School!");
  const preparedLink = page.getByRole("link", {
    name: /Open your prepared WhatsApp/,
  });
  await expect(preparedLink).toHaveAttribute("href", url);
  await preparedLink.focus();
  await preparedLink.press("Tab");
  const summary = page.locator(".message-preview summary");
  await expect(summary).toBeFocused();
  await summary.press("Enter");
  await expect(page.locator(".message-preview")).toHaveAttribute("open", "");
  await expect(
    page.getByRole("textbox", { name: "Prepared enquiry message" }),
  ).toHaveValue(/Test Enquiry/);
  await page.getByRole("button", { name: "Email", exact: true }).click();
  await page
    .getByRole("button", { name: "Prepare email enquiry", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: /Open your prepared email/ }),
  ).toHaveAttribute("href", /^mailto:floraplayschool@gmail.com\?/);
  await expect(page.getByRole("status")).toContainText("not sent yet");
});

test("mobile menu works, and desktop menu remains visible", async ({
  page,
}, info) => {
  if (info.project.name === "Mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Flora Play School" })
      .click();
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else {
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(
      page
        .getByRole("navigation")
        .getByRole("link", { name: "Flora Play School" }),
    ).toBeVisible();
  }
});

test("local official video plays and YouTube requires explicit opt-in", async ({
  page,
}) => {
  await page
    .getByRole("button", {
      name: "Watch: A celebration of our learning family",
      exact: true,
    })
    .click();
  const video = page.locator(".video-player video");
  await expect(video).toBeVisible();
  await expect
    .poll(() => video.evaluate((v) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  expect(await video.evaluate((v) => v.duration)).toBeGreaterThan(80);
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", {
      name: "Watch: See a concept come to life",
      exact: true,
    })
    .click();
  await expect(page.locator(".video-player iframe")).toHaveCount(0);
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Opt-in player test</body></html>",
    }),
  );
  await page
    .getByRole("button", { name: "Play here · loads YouTube", exact: true })
    .click();
  await expect(page.locator(".video-player iframe")).toHaveAttribute(
    "src",
    /Q9HwMe4aFW0/,
  );
});

test("Google Maps loads only when requested and uses verified coordinates", async ({
  page,
}) => {
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator(".google-map")).toHaveCount(0);
  await page.route("https://maps.google.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Opt-in map test</body></html>",
    }),
  );
  await page
    .getByRole("button", { name: /Load interactive Google Map/ })
    .click();
  await expect(page.locator(".google-map")).toHaveAttribute(
    "src",
    /22.5331322,88.3867218/,
  );
  await expect(
    page.getByRole("link", { name: "Get directions", exact: true }),
  ).toHaveAttribute("href", "https://maps.app.goo.gl/1enz3x4GEpiizJkp6");
});

test("source notes and privacy information are accessible dialogs", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Sources & content notes", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Instagram links are included",
  );
  await expect(page.locator(".source-list a")).toHaveCount(8);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Privacy & enquiries", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "No enquiry is sent automatically",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("no horizontal overflow on target widths and motion preference is honoured", async ({
  page,
}) => {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `overflow at ${width}px`).toBeFalsy();
  }
  expect(
    await page
      .locator(".learning-rail>div")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

test("programme overview and provenance are downloadable real files", async ({
  request,
}) => {
  const pdf = await request.get("/downloads/isca-flora-programme-overview.pdf");
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  const research = await request.get("/downloads/research-and-website-copy.md");
  expect(research.status()).toBe(200);
  expect(await research.text()).toContain("Conflicts, historical offers");
  const media = await request.get("/downloads/media-provenance.csv");
  expect(await media.text()).toContain("annual-function-2026.mp4");
});

test("homepage and enquiry pass the automated WCAG A / AA rule scan", async ({
  page,
}) => {
  const home = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    home.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.locator(".nav-enquire").click();
  const enquiry = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    enquiry.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
