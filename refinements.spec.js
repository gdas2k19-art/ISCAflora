import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("hero uses the requested journey photo and syllabus thumbnail with appropriate actions", async ({
  page,
}) => {
  await expect(page.locator(".hero-main-photo img")).toHaveAttribute(
    "src",
    "/media/annual-students.webp",
  );
  await expect(page.locator(".hero-syllabus img")).toHaveAttribute(
    "src",
    "/media/isca-introduction.webp",
  );
  await page.locator(".hero-main-photo").click();
  await expect(page.getByRole("dialog")).toContainText(
    "Celebrating the journey, together.",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", {
      name: "Watch Education beyond the syllabus",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Education beyond the syllabus",
  );
  await expect(page.locator(".video-player video")).toHaveAttribute(
    "src",
    "/media/isca-official-reel.mp4",
  );
});

test("dark device preference cannot change the website light UI", async ({
  page,
}) => {
  const initial = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    text: getComputedStyle(document.body).color,
    scheme: getComputedStyle(document.documentElement).colorScheme,
  }));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  const dark = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    text: getComputedStyle(document.body).color,
    scheme: getComputedStyle(document.documentElement).colorScheme,
  }));
  expect(dark).toEqual(initial);
  expect(dark.scheme).toContain("light");
  expect(dark.scheme).toContain("only");
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute(
    "content",
    "only light",
  );
  await page.locator(".nav-enquire").click();
  expect(
    await page
      .getByLabel("Your name")
      .evaluate((e) => getComputedStyle(e).backgroundColor),
  ).toBe("rgb(255, 255, 255)");
});

test("modern variable fonts are local, loaded and applied to body and headings", async ({
  page,
}) => {
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    heading: getComputedStyle(document.querySelector("h1")).fontFamily,
    outfit: document.fonts.check("700 32px Outfit"),
    jakarta: document.fonts.check('400 16px "Plus Jakarta Sans"'),
  }));
  expect(fonts.body).toContain("Plus Jakarta Sans");
  expect(fonts.heading).toContain("Outfit");
  expect(fonts.outfit).toBeTruthy();
  expect(fonts.jakarta).toBeTruthy();
});

test("programme search matches verified tags and works together with category filters", async ({
  page,
}) => {
  const search = page.getByRole("searchbox", { name: "Search programmes" });
  await search.fill(" NEET ");
  await expect(page.locator(".programme-card")).toHaveCount(1);
  await expect(page.locator(".programme-card")).toContainText(
    "Bigger ambitions",
  );
  await page.getByRole("button", { name: "Clear programme search" }).click();
  await expect(page.locator(".programme-card")).toHaveCount(6);
  await page
    .getByRole("group", { name: "Filter programmes" })
    .getByRole("button", { name: "Life skills", exact: true })
    .click();
  await search.fill("python");
  await expect(page.locator(".programme-card")).toHaveCount(1);
  await expect(page.locator(".programme-card")).toContainText(
    "Skills for what’s next",
  );
});

test("empty programme results have a clear reset without losing keyboard usability", async ({
  page,
}) => {
  await page
    .getByRole("searchbox", { name: "Search programmes" })
    .fill("No matching course");
  await expect(page.locator(".programme-card")).toHaveCount(0);
  await expect(page.locator(".search-empty")).toBeVisible();
  await expect(page.locator(".programme-search-count")).toContainText(
    "0 programmes",
  );
  await page.getByRole("button", { name: "Reset search and filters" }).click();
  await expect(page.locator(".programme-card")).toHaveCount(6);
  await expect(
    page.getByRole("searchbox", { name: "Search programmes" }),
  ).toHaveValue("");
});

test("Flora age guide reflects published boundaries without claiming admission", async ({
  page,
}) => {
  const age = page.getByRole("spinbutton", { name: "Child’s age in years" });
  const check = page.getByRole("button", { name: "Check published age band" });
  for (const [value, stage] of [
    ["2.5", "Montessori 1"],
    ["3.5", "Montessori 2"],
    ["4.5", "L.K.G / KG"],
    ["5.5", "L.K.G / KG"],
  ]) {
    await age.fill(value);
    await check.click();
    await expect(page.locator(".age-guide-result")).toContainText(stage);
    await expect(page.locator(".age-guide-result")).toContainText(
      "school confirms",
    );
  }
  await age.fill("6");
  await check.click();
  await expect(page.locator(".age-guide-result")).toContainText(
    "outside the published",
  );
  await expect(page.locator(".age-guide-result")).toContainText(
    "no admission decision",
  );
});

test("search, age guide and light theme pass automated rule checks in dark device mode", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page
    .getByRole("searchbox", { name: "Search programmes" })
    .fill("English");
  await page
    .getByRole("spinbutton", { name: "Child’s age in years" })
    .fill("3.5");
  await page.getByRole("button", { name: "Check published age band" }).click();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
