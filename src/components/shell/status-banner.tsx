"use client";

import { CloudOff, RefreshCw, TriangleAlert } from "lucide-react";
import { useGuide } from "@/components/guide/guide-provider";

/** Honest connectivity / storage state. Never hides that a view may be out of date. */
export function StatusBanner() {
  const { status, storageError, refresh } = useGuide();
  if (storageError) return <Banner icon={<TriangleAlert size={16} />} text={storageError} />;
  if (status === "stale")
    return (
      <Banner
        icon={<CloudOff size={16} />}
        text="Showing your last saved guide. It may not reflect your latest progress until you're back online."
        action={{ label: "Retry", onClick: refresh }}
      />
    );
  if (status === "offline-empty") return <Banner icon={<CloudOff size={16} />} text="You're offline. Connect once to load your guide." />;
  if (status === "error")
    return <Banner icon={<TriangleAlert size={16} />} text="The guide couldn't load." action={{ label: "Retry", onClick: refresh }} />;
  return null;
}

function Banner({ icon, text, action }: { icon: React.ReactNode; text: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div role="status" className="mb-4 flex items-center gap-3 rounded-2xl border border-rule-strong bg-panel-2/70 py-2 pl-3.5 pr-1.5 text-[0.875rem] text-ivory-2">
      <span className="shrink-0 text-gold" aria-hidden>
        {icon}
      </span>
      <p className="min-w-0 flex-1 leading-snug">{text}</p>
      {action && (
        <button type="button" onClick={action.onClick} className="tap flex min-h-11 items-center gap-1.5 rounded-xl px-3 font-medium text-ivory hover:bg-ivory/5">
          <RefreshCw size={14} aria-hidden /> {action.label}
        </button>
      )}
    </div>
  );
}
