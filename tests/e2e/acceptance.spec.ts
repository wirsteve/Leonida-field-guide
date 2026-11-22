/**
 * Acceptance suite: one test per feature area of the product spec.
 * Runs locally (npm run test:e2e) or against the deployed site:
 *   E2E_BASE_URL=https://leonida-field-guide-kappa.vercel.app npx playwright test acceptance --trace off
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const FUTURE = [
  "coffee break", "afternoon delight", "checking out", "welcome to vice city", "the cartel heist", "vcia takedown",
  "the end of the road", "operation savage glory", "twist wrist", "veteran hunted", "chapter 03", "chapter 3", "chapter 4", "chapter 5",
];
const ROUTES = ["/", "/strategy", "/money", "/explore", "/journal"];

/** Real onboarding: one-tap starting point, reconcile two errands, enter cash. */
async function setup(page: Page) {
  await page.goto("/");
  await page.getByRole("link", { name: /Tell the guide where you are/ }).click();
  await page.getByRole("button", { name: /^Start/ }).click();
  await page.getByRole("button", { name: /Just finished the breakfast stickup/ }).click();
  await expect(page.getByRole("heading", { name: "Which of these have you done?" })).toBeVisible();
  await page.getByRole("radiogroup", { name: "Daily Driver" }).getByRole("radio", { name: "Done" }).click();
  await page.getByRole("radiogroup", { name: "Behind on Payments" }).getByRole("radio", { name: "Done" }).click();
  await page.getByRole("button", { name: /^Continue/ }).click();
  await page.getByRole("main").getByLabel("Cash on hand").fill("8400");
  await page.getByRole("button", { name: "Save and finish" }).click();
  await page.getByRole("button", { name: /Open my guide/ }).click();
  await expect(page.getByRole("heading", { name: "Impounded Vehicle" })).toBeVisible();
}

const main = (page: Page) => page.getByRole("main");

test.describe("§2 player profile & onboarding reconciliation", () => {
  test("one-tap starting point sets Chapter 2 progress without marking optional content", async ({ page }) => {
    await setup(page);
    await expect(page.getByText("Chapter 02 · Current progress")).toBeVisible();
    await page.goto("/journal");
    // Optional missions were not auto-completed.
    await expect(main(page).getByRole("button", { name: /Mark Check Out McKittrick Farm complete/ })).toBeVisible();
  });

  test("typed informal alias ('breakfast stickup') identifies the mission from a fresh install", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByRole("button", { name: /^Start/ }).click();
    await page.getByLabel("Last story mission you finished").fill("breakfast stickup");
    await page.getByRole("button", { name: "Find it" }).click();
    await expect(page.getByText("Found it")).toBeVisible();
    await expect(page.getByText(/story missions before it as complete/)).toBeVisible();
  });

  test("an unknown or future title is not confirmed during setup", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByRole("button", { name: /^Start/ }).click();
    await page.getByLabel("Last story mission you finished").fill("zzqx not a mission");
    await page.getByRole("button", { name: "Find it" }).click();
    await expect(page.getByText("We couldn't confirm that name.")).toBeVisible();
  });

  test("a catch-up link advances story progress in one tap; a bad link changes nothing", async ({ page }) => {
    await page.goto("/catch-up?to=nope");
    await expect(page.getByText("That link didn't work.")).toBeVisible();
    await setup(page);
    await page.goto("/catch-up?to=cp-214");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Progress updated")).toBeVisible();
    await expect(main(page).getByRole("region", { name: "Cash plan" })).toBeVisible();
  });
});

test.describe("§7–8 navigation & Home", () => {
  test("five tabs, editorial masthead, chapter indicator without totals", async ({ page }) => {
    await setup(page);
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const tab of ["Home", "Strategy", "Money", "Explore", "Journal"]) await expect(nav.getByRole("link", { name: tab })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: /Leonida\s*Field Guide/ })).toBeVisible();
    await expect(page.getByText("Your personal playthrough")).toBeVisible();
    await expect(page.getByText(/Chapter 02 · Current progress/)).toBeVisible();
    await expect(page.getByText(/of \d+ chapters|\d+\s*\/\s*\d+ chapters/i)).toHaveCount(0);
  });

  test("hero next best move with priority, View Strategy and Mark Complete", async ({ page }) => {
    await setup(page);
    const hero = page.locator('section[aria-labelledby="next-move-title"]');
    await expect(hero.getByText("Your next best move")).toBeVisible();
    await expect(hero.getByText(/Do now|Recommended|Last chance|Optional|Wait/)).toBeVisible();
    await expect(hero.getByRole("button", { name: /Mark complete/ })).toBeVisible();
    await expect(hero.getByRole("link", { name: "View strategy" })).toBeVisible();
  });

  test("route queue, readiness, money snapshot and explore suggestion", async ({ page }) => {
    await setup(page);
    await expect(page.getByRole("heading", { name: "The route" })).toBeVisible();
    await expect(main(page).locator("ol li").first()).toBeVisible();
    await expect(page.getByText(/Safe to advance|Complete these first|Last chance|Not fully verified/).first()).toBeVisible();
    await expect(page.getByText("Recorded cash")).toBeVisible();
    await expect(main(page).getByText("$8,400")).toBeVisible();
    await expect(page.getByText(/Best now:|No verified earning option|Current earning options/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Explore" })).toBeVisible();
  });

  test("the three key interactions are one tap from Home", async ({ page }) => {
    await setup(page);
    for (const name of ["What next?", "Check before starting", "Mark complete"]) {
      await expect(main(page).getByRole("button", { name }).first()).toBeVisible();
    }
    await main(page).getByRole("button", { name: "Mark complete" }).first().click();
    await expect(page.getByRole("dialog").getByText("What did you just finish?")).toBeVisible();
  });

  test("Ask the guide answers common questions offline and opens the answer", async ({ page }) => {
    await setup(page);
    const ask = main(page).getByRole("region", { name: "Ask the guide" });
    await ask.getByRole("button", { name: "How do I make money?" }).click();
    await expect(ask.getByText("Answer")).toBeVisible();
    await expect(ask.getByText(/Best way to earn now|to go to reach/)).toBeVisible();
    await ask.getByRole("button", { name: "Clear" }).click();
    await ask.getByLabel("Ask the guide").fill("where can I play golf");
    await ask.getByLabel("Ask the guide").press("Enter");
    await ask.getByRole("button", { name: /golf/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("mark complete, then undo", async ({ page }) => {
    await setup(page);
    await page.locator('section[aria-labelledby="next-move-title"]').getByRole("button", { name: /Mark complete/ }).click();
    await expect(page.getByText(/Marked complete · Impounded Vehicle/)).toBeVisible();
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.getByRole("heading", { name: "Impounded Vehicle" })).toBeVisible();
  });
});

test.describe("§9 Check Before Starting", () => {
  test("lists only startable missions, gives a verdict, and treats future titles like gibberish", async ({ page }) => {
    await setup(page);
    await main(page).getByRole("button", { name: "Check before starting" }).first().click();
    const sheet = page.getByRole("dialog");
    await expect(sheet.getByRole("button", { name: "Continue the story" })).toBeVisible();
    await sheet.getByLabel("Mission name").fill("Aft");
    await expect(sheet.getByText(/Afternoon/i)).toHaveCount(0);
    await sheet.getByLabel("Mission name").fill("");
    await sheet.getByRole("button", { name: "Continue the story" }).click();
    await expect(sheet.getByText(/^(Go ahead|Do these first|Last chance|Save first|Unverified)$/)).toBeVisible();
    await sheet.getByRole("button", { name: /Check another mission/ }).click();
    await sheet.getByLabel("Mission name").fill("Afternoon Delight");
    await sheet.getByLabel("Mission name").press("Enter");
    await expect(sheet.getByText("Unverified")).toBeVisible();
    await expect(sheet.getByText("Afternoon Delight", { exact: true })).toHaveCount(0);
  });
});

test.describe("§10 chapter strategy", () => {
  test("chapter plan with readiness, save advice and numbered sections", async ({ page }) => {
    await setup(page);
    await page.goto("/strategy");
    await expect(page.getByText(/Chapter 02 · Strategy/)).toBeVisible();
    await expect(page.getByText("Save advice")).toBeVisible();
    await expect(page.getByText("§1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recommended order" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Money" })).toBeVisible();
  });
});

test.describe("§11 money", () => {
  test("cash, target, verdict, methods with payout/repeatability/risk; cash is editable", async ({ page }) => {
    await setup(page);
    await page.goto("/money");
    await expect(page.getByText("The verdict")).toBeVisible();
    await expect(page.getByText(/Best way to earn now:/)).toBeVisible();
    await expect(page.getByText("Available earning methods")).toBeVisible();
    for (const label of ["Payout", "Repeat", "Risk"]) await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    await main(page).getByRole("button", { name: "Update" }).click();
    const sheet = page.getByRole("dialog");
    await sheet.getByLabel("Cash on hand").fill("9000");
    await sheet.getByLabel("Savings goal").fill("15000");
    await sheet.getByRole("button", { name: "Save" }).click();
    await expect(main(page).getByText("$9,000").first()).toBeVisible();
    await expect(page.getByText(/Goal \$15,000/)).toBeVisible();
    const plan = main(page).getByRole("region", { name: "Cash plan" });
    await expect(plan.getByText("Your plan to $15,000")).toBeVisible();
    await expect(plan.getByText("$6,000")).toBeVisible();
    await expect(plan.getByRole("listitem").first()).toBeVisible();
  });
});

test.describe("§12 exploration", () => {
  test("filters, separate 100% vs unique counters, Try this, collectibles and trophies", async ({ page }) => {
    await setup(page);
    await page.goto("/explore");
    await expect(page.getByText("Unique content experienced")).toBeVisible();
    await expect(page.getByText("Official 100% items done")).toBeVisible();
    const filters = page.getByRole("toolbar", { name: "Filters" });
    for (const f of ["All", "Try this", "Do first", "Unique", "Under 20 min", "Missable", "Done"]) await expect(filters.getByRole("button", { name: f })).toBeAttached();
    await expect(page.getByRole("toolbar", { name: "Areas" }).getByRole("button", { name: /Port Gellhorn/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Try this/ })).toBeVisible();
    await expect(main(page).getByText("ATM Yank").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Collectibles & 100% checklist" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Trophies" })).toBeVisible();
    // Collectible counter works.
    await main(page).getByRole("button", { name: "One more Vehicles discovered" }).click();
    await expect(main(page).getByText(/1 found of 277/)).toBeVisible();
    // Filter narrows the list.
    await filters.getByRole("button", { name: "Try this" }).click();
    await expect(page.getByRole("heading", { name: "Trophies" })).toHaveCount(0);
  });
});

test.describe("§14 journal", () => {
  test("notes, timeline with undo, mission toggles and backup export", async ({ page }) => {
    await setup(page);
    await page.goto("/journal");
    await page.getByLabel("New note").fill("Stash spot: behind the motel");
    await page.getByRole("button", { name: "Add note" }).click();
    await expect(page.getByText("Stash spot: behind the motel")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible();
    await page.getByRole("button", { name: "Undo last" }).click();
    await expect(page.getByText("Stash spot: behind the motel")).toHaveCount(0);
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export" }).click();
    expect((await download).suggestedFilename()).toMatch(/^leonida-field-guide-.*\.json$/);
  });

  test("progress survives a reload", async ({ page }) => {
    await setup(page);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Impounded Vehicle" })).toBeVisible();
    await expect(main(page).getByText("$8,400")).toBeVisible();
  });
});

test.describe("§3 spoiler protection", () => {
  test("no future titles or later chapters anywhere in the UI", async ({ page }) => {
    await setup(page);
    for (const route of ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const text = (await page.locator("body").innerText()).toLowerCase();
      for (const f of FUTURE) expect(text, `${route} shows "${f}"`).not.toContain(f);
    }
  });

  test("guide API returns no-store responses and leaks nothing future", async ({ page }) => {
    await page.goto("/");
    const result = await page.evaluate(async () => {
      const snapshot = { schemaVersion: 1, completed: [], unsure: [], discovered: [], collectibles: {}, cash: null, cashTarget: null };
      const post = (path: string, body: unknown) => fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const res = await post("/api/guide/evaluate", { snapshot });
      const miss = async (query: string) => (await post("/api/guide/check", { snapshot, query })).text();
      return {
        status: res.status,
        cache: res.headers.get("cache-control") ?? "",
        body: (await res.text()).toLowerCase(),
        future: await miss("The End of the Road"),
        gibberish: await miss("zzqx gibberish"),
      };
    });
    expect(result.status).toBe(200);
    expect(result.cache).toContain("no-store");
    for (const f of [...FUTURE, "breakfast run", "powerpyx.com", "game8.co", "gtabase.com", "https://", "visiblewhen", "restricted"]) expect(result.body).not.toContain(f);
    expect(result.future).toBe(result.gibberish);
  });
});

test.describe("§6 & §15 quality, PWA and iPhone fit", () => {
  test("installable: manifest, icons, Apple web-app meta, service worker", async ({ page }) => {
    await page.goto("/");
    const manifest = await page.evaluate(async () => (await fetch("/manifest.webmanifest")).json());
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /viewport-fit=cover/);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    expect(await page.locator('meta[name="mobile-web-app-capable"], meta[name="apple-mobile-web-app-capable"]').count()).toBeGreaterThan(0);
    await page.waitForFunction(async () => Boolean(await navigator.serviceWorker?.getRegistration()), null, { timeout: 15_000 });
  });

  test("opens offline after a first visit", async ({ page, context }) => {
    await setup(page);
    await page.waitForFunction(async () => Boolean((await navigator.serviceWorker?.getRegistration())?.active), null, { timeout: 15_000 });
    await page.reload({ waitUntil: "networkidle" });
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByText("Your personal playthrough")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Impounded Vehicle" })).toBeVisible();
    await context.setOffline(false);
  });

  test("no horizontal scroll at 320px and touch targets at least 44px", async ({ page }) => {
    await setup(page);
    await page.setViewportSize({ width: 320, height: 640 });
    const small: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${route} overflows`).toBeLessThanOrEqual(0);
      const found = await page.evaluate(() =>
        [...document.querySelectorAll("main button, main a, nav a")]
          .filter((el) => (el as HTMLElement).offsetParent !== null && !el.closest("[hidden]"))
          .map((el) => ({ h: el.getBoundingClientRect().height, label: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40) }))
          .filter(({ h }) => h > 0 && h < 44),
      );
      small.push(...found.map((f) => `${route}: "${f.label}" ${Math.round(f.h)}px`));
    }
    expect(small).toEqual([]);
  });

  test("no serious or critical accessibility violations", async ({ page }) => {
    await setup(page);
    const problems: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const { violations } = await new AxeBuilder({ page }).analyze();
      for (const v of violations.filter((x) => x.impact === "serious" || x.impact === "critical")) {
        problems.push(`${route}: ${v.id} (${v.nodes.length}) ${v.help}`);
      }
    }
    expect(problems).toEqual([]);
  });
});
