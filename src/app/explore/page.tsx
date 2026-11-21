import { PageHeader } from "@/components/shell/masthead";
import { PendingPanel } from "@/components/shell/pending-panel";

export default function Page() {
  return (
    <main className="page">
      <PageHeader eyebrow="Explore" title="Field notes" lede="Activities, places and one-of-a-kind moments you can reach now." />
      <PendingPanel title="Exploration" body="Only places you've discovered or can already reach will appear here." />
    </main>
  );
}
