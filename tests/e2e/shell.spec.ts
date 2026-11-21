import { expect, test } from "@playwright/test";

const TABS = ["Home", "Strategy", "Money", "Explore", "Journal"];

test("app shell renders five tabs without horizontal scroll", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const tab of TABS) await expect(nav.getByRole("link", { name: tab })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  await nav.getByRole("link", { name: "Money" }).click();
  await expect(page).toHaveURL(/\/money$/);
  await expect(nav.getByRole("link", { name: "Money" })).toHaveAttribute("aria-current", "page");
});

test("tab targets are at least 44px tall", async ({ page }) => {
  await page.goto("/");
  const boxes = await page.getByRole("navigation", { name: "Primary" }).getByRole("link").evaluateAll((els) =>
    els.map((el) => el.getBoundingClientRect().height),
  );
  for (const h of boxes) expect(h).toBeGreaterThanOrEqual(44);
});
