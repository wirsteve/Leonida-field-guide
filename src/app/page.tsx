import { Masthead } from "@/components/shell/masthead";
import { PendingPanel } from "@/components/shell/pending-panel";

export default function HomePage() {
  return (
    <main className="page">
      <Masthead chapterLabel="Chapter 02" />
      <PendingPanel
        title="Your next best move"
        body="The recommendation engine isn't connected yet. Once it is, this panel will show the single smartest thing to do next, based on what you've recorded."
      />
    </main>
  );
}
