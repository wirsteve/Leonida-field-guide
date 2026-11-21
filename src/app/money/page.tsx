import { PageHeader } from "@/components/shell/masthead";
import { PendingPanel } from "@/components/shell/pending-panel";

export default function Page() {
  return (
    <main className="page">
      <PageHeader eyebrow="Money" title="Money planner" lede="Your best way to earn right now, and whether grinding is worth it." />
      <PendingPanel title="Earning strategy" body="Money advice will appear here once verified earning methods are loaded." />
    </main>
  );
}
