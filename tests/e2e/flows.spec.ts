import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/** Seed progress through the real Journal import (Chapter 1 + Chapter 2 up to the 12th story mission). */
async function seed(page: Page) {
  const now = new Date().toISOString();
  const ids = [...Array(22)].map((_, i) => `story-${101 + i}`).concat([...Array(12)].map((_, i) => `story-${201 + i}`));
  const backup = {
    format: "leonida-field-guide-backup",
    formatVersion: 1,
    exportedAt: now,
    appVersion: "e2e",
    state: {
      schemaVersion: 1, profileId: "e2e", createdAt: now, updatedAt: now, game: "gta-vi",
      marks: Object.fromEntries(ids.map((id) => [id, { mark: "complete", at: now, via: "import" }])),
      discovered: {}, collectibles: {}, cash: { amount: 8400, updatedAt: now, target: 15000 },
      notes: [], timeline: [], onboarding: { status: "complete", completedAt: now },
    },
  };
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "lfg-")), "backup.json");
  fs.writeFileSync(file, JSON.stringify(backup));
  await page.goto("/journal");
  await page.setInputFiles('input[type="file"]', file);
  await page.getByRole("button", { name: "Replace" }).click();
  await expect(page.getByText("Backup restored")).toBeVisible();
}

test("progress survives a reload and drives the Home recommendation", async ({ page }) => {
  await seed(page);
  await page.reload();
  await page.goto("/");
  await expect(page.getByText("Chapter 02 · Current progress")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Impounded Vehicle" })).toBeVisible();
  await expect(page.getByText("$8,400")).toBeVisible();
});

test("mark complete, then undo", async ({ page }) => {
  await seed(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Mark complete" }).nth(1).click(); // hero (quick action is first)
  await expect(page.getByText(/Marked complete · Impounded Vehicle/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Impounded Vehicle" })).toHaveCount(0);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("heading", { name: "Impounded Vehicle" })).toBeVisible();
});

test("check before starting shows a verdict without naming the next story mission", async ({ page }) => {
  await seed(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Check before starting" }).first().click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByRole("button", { name: "Continue the story" })).toBeVisible();
  await sheet.getByRole("button", { name: "Continue the story" }).click();
  await expect(sheet.getByText(/Go ahead|Do these first|Last chance|Save first|Unverified/).first()).toBeVisible();

  // Typing a future title must behave like nonsense.
  await sheet.getByRole("button", { name: /Check another mission/ }).click();
  await sheet.getByLabel("Mission name").fill("Afternoon Delight");
  await sheet.getByLabel("Mission name").press("Enter");
  await expect(sheet.getByText("Unverified")).toBeVisible();
  await expect(sheet.getByText("Afternoon Delight", { exact: true })).toHaveCount(0);
});

test("no withheld or future titles appear anywhere in the UI", async ({ page }) => {
  await seed(page);
  for (const route of ["/", "/strategy", "/money", "/explore", "/journal"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const title of ["coffee break", "afternoon delight", "checking out", "vice city", "thrillbillies", "veteran hunted"]) {
      expect(text, `${route} shows "${title}"`).not.toContain(title);
    }
  }
});

test("a rollback while offline withholds the previously unlocked view", async ({ page, context }) => {
  await seed(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Impounded Vehicle" })).toBeVisible();
  // Complete the next story mission while online: new jobs unlock.
  await page.getByRole("button", { name: "Mark complete" }).first().click();
  const sheet = page.getByRole("dialog");
  await sheet.getByRole("button", { name: "Done" }).first().click(); // "Continue the story" is listed first
  await sheet.getByRole("button", { name: "Close" }).click();
  await page.goto("/journal");
  await expect(page.getByText("The pawn shop job").first()).toBeVisible();
  // Go offline, then undo: the unlocked content must disappear at once.
  await context.setOffline(true);
  await page.getByRole("button", { name: "Undo last" }).click();
  await expect(page.getByText("The pawn shop job")).toHaveCount(0);
  await context.setOffline(false);
});
