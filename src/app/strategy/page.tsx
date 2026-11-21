import { PageHeader } from "@/components/shell/masthead";
import { PendingPanel } from "@/components/shell/pending-panel";

export default function Page() {
  return (
    <main className="page">
      <PageHeader eyebrow="Strategy" title="Your chapter plan" lede="What to do, in what order, and when to stop and do something else." />
      <PendingPanel title="Chapter strategy" body="The adaptive chapter plan will appear here once the guide engine and researched content are connected." />
    </main>
  );
}
