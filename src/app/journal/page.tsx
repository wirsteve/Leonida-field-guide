import { PageHeader } from "@/components/shell/masthead";
import { PendingPanel } from "@/components/shell/pending-panel";

export default function Page() {
  return (
    <main className="page">
      <PageHeader eyebrow="Journal" title="Your journal" lede="Missions, milestones, notes and backups." />
      <PendingPanel title="Progress journal" body="Progress tracking will appear here once the shared persistence layer is connected." />
    </main>
  );
}
