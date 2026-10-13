import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const opening = (page) =>
  page.getByRole("dialog", { name: "ISCA opening experience", exact: true });
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("reduced-motion visitors go straight to the usable website", async ({
  page,
}) => {
  await expect(opening(page)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Replay opening", exact: true }),
  ).toBeDisabled();
  await page.locator(".nav-enquire").click();
  await expect(page.getByLabel("Your name")).toBeVisible();
});

test("brand opening is skippable, accessible and unlocks the page immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(opening(page)).toBeVisible();
  await expect(page.locator("#root")).toHaveAttribute("inert", "");
  await expect(
    page.getByRole("button", { name: "Skip opening animation", exact: true }),
  ).toBeFocused();
  expect(
    await page
      .locator(".opening-logo img")
      .evaluate((i) => i.complete && i.naturalWidth > 0),
  ).toBeTruthy();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(opening(page)).toHaveCount(0);
  await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await page.locator(".nav-enquire").click();
  await expect(page.getByLabel("Your name")).toBeVisible();
});

test("opening ends on its own and does not repeat after a same-tab refresh", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(opening(page)).toBeVisible();
  await expect(opening(page)).toHaveCount(0, { timeout: 6000 });
  expect(
    await page.evaluate(() => sessionStorage.getItem("isca-opening-seen-v1")),
  ).toBe("1");
  await page.reload();
  await expect(opening(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Better futures.",
  );
});

test("replay supports keyboard focus trapping, skip and focus restoration", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const replay = page.getByRole("button", {
    name: "Replay opening",
    exact: true,
  });
  await expect(replay).toBeEnabled();
  await replay.click();
  const skip = page.getByRole("button", {
    name: "Skip opening animation",
    exact: true,
  });
  await expect(skip).toBeFocused();
  await skip.press("Tab");
  await expect(skip).toBeFocused();
  await skip.press("Shift+Tab");
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(opening(page)).toHaveCount(0);
  await expect(replay).toBeFocused();
});

test("changing motion preference mid-opening stops it without leaving an inert page", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(opening(page)).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(opening(page)).toHaveCount(0);
  await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
  await expect(
    page.getByRole("button", { name: "Replay opening", exact: true }),
  ).toBeDisabled();
  await page.locator(".nav-enquire").click();
  await expect(page.getByLabel("Your name")).toBeVisible();
});

test("welcome can be replayed directly from the homepage", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const button = page.getByRole("button", {
    name: "Watch the welcome",
    exact: true,
  });
  await expect(button).toBeEnabled();
  await button.click();
  await expect(opening(page)).toBeVisible();
  await page
    .getByRole("button", { name: "Skip opening animation", exact: true })
    .click();
  await expect(button).toBeFocused();
});

test("explicit intro review URL replays even after the tab has seen it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() =>
    sessionStorage.setItem("isca-opening-seen-v1", "1"),
  );
  await page.goto("/?intro=1");
  await expect(opening(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opening(page)).toHaveCount(0);
});

test("review URL still honours reduced motion", async ({ page }) => {
  await page.goto("/?intro=1");
  await expect(opening(page)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Watch the welcome", exact: true }),
  ).toBeDisabled();
});
