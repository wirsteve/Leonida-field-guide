import { expect, test } from "@playwright/test";
import { GUIDE_API } from "../../src/contracts/api";
import type { ProgressSnapshot } from "../../src/contracts/player-state";

const snapshot: ProgressSnapshot = {
  schemaVersion: 1, completed: [], unsure: [], discovered: [], collectibles: {}, cash: null, cashTarget: null,
};

test("guide API responses are uncached and unknown input is never echoed", async ({ request }) => {
  const evaluate = await request.post(GUIDE_API.evaluate, { data: { snapshot } });
  expect(evaluate.ok()).toBe(true);
  expect(evaluate.headers()["cache-control"]).toBe("no-store");
  expect(await evaluate.json()).toMatchObject({ contractVersion: 1 });

  const query = "SYNTHETIC unknown mission that should never be echoed";
  const check = await request.post(GUIDE_API.check, { data: { snapshot, query } });
  expect(check.ok()).toBe(true);
  expect(check.headers()["cache-control"]).toBe("no-store");
  const raw = await check.text();
  expect(raw).not.toContain(query);
  expect(JSON.parse(raw)).toMatchObject({ matched: null, verdict: "unverified" });
});
