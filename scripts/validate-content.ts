/**
 * npm run content:validate — validates the authored guide dataset.
 * Runs with the react-server condition so `server-only` modules load.
 */
import { loadGuideDataset } from "../src/content/guide";
import { validateDataset } from "../src/content/tooling/validate";

const { dataset, issues } = validateDataset(loadGuideDataset());
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

for (const i of issues) console.log(`${i.level === "error" ? "✖" : "⚠"} ${i.recordId ? `[${i.recordId}] ` : ""}${i.message}`);
if (dataset) {
  const byVerification = dataset.records.reduce<Record<string, number>>((acc, r) => {
    acc[r.verification] = (acc[r.verification] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`\n${dataset.records.length} records · content ${dataset.contentVersion} · ${JSON.stringify(byVerification)}`);
}
console.log(`${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
