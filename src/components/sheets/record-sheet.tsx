"use client";

import { Check, CircleHelp, Clock, MapPin, RotateCcw, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useGuide, useRecord } from "@/components/guide/guide-provider";
import { CONFIDENCE_LABEL, KIND_LABEL, isOutstanding, sourceLine, triLabel } from "@/components/guide/labels";
import { useActions } from "@/components/shell/actions-provider";
import { Button, formatCash, formatMinutes } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";

export function RecordSheet({ recordId, onClose }: { recordId?: string; onClose: () => void }) {
  const record = useRecord(recordId);
  const { evaluation } = useGuide();
  const { mark, openCheck } = useActions();
  const open = Boolean(recordId && record);
  if (!record) return null;

  const isMission = record.kind === "story-mission" || record.kind === "side-mission";
  const outstanding = isOutstanding(record);
  const queued = evaluation?.queue.find((q) => q.recordId === record.id);
  const minutes = formatMinutes(record.estimatedMinutes);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow={[KIND_LABEL[record.kind], record.area?.label].filter(Boolean).join(" · ")}
      title={record.name}
      footer={
        <div className="flex flex-wrap gap-2">
          {outstanding ? (
            <>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={async () => {
                  await mark(record, "complete");
                  onClose();
                }}
              >
                <Check size={18} aria-hidden /> Mark complete
              </Button>
              {record.status !== "unsure" && (
                <Button size="lg" onClick={() => mark(record, "unsure")}>
                  <CircleHelp size={18} aria-hidden /> Not sure
                </Button>
              )}
            </>
          ) : (
            <Button size="lg" className="flex-1" onClick={() => mark(record, null)}>
              <RotateCcw size={18} aria-hidden /> Mark not done
            </Button>
          )}
          {isMission && outstanding && (
            <Button
              variant="quiet"
              size="lg"
              className="w-full"
              onClick={() => openCheck(record.id)}
            >
              <ShieldCheck size={18} aria-hidden /> Check before starting
            </Button>
          )}
        </div>
      }
    >
      {record.lastChance && (
        <div className="mb-4 rounded-2xl bg-flare/12 p-3.5 ring-1 ring-inset ring-flare/40">
          <p className="eyebrow text-flare">Last chance</p>
          <p className="mt-1.5 text-[0.95rem] text-ivory">{record.lastChanceCopy ?? "Finish this before continuing."}</p>
        </div>
      )}

      {record.status === "completed" && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sea/12 px-3 py-1 text-[0.8125rem] font-medium text-sea">
          <Check size={14} aria-hidden /> Completed
        </p>
      )}
      {record.status === "closed" && (
        <p className="mb-3 rounded-xl bg-panel-2 px-3 py-2 text-[0.875rem] text-ivory-2">No longer available.</p>
      )}

      <p className="text-[1rem] leading-relaxed text-ivory-2">{record.summary}</p>

      <div className="mt-4 border-l-2 border-gold/70 pl-3.5">
        <p className="eyebrow text-gold">Field note</p>
        <p className="mt-1.5 text-[1rem] leading-relaxed text-ivory">{queued?.body ?? record.guidance}</p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2">
        {minutes && <Fact icon={<Clock size={15} />} label="Time" value={minutes} />}
        {record.area && <Fact icon={<MapPin size={15} />} label="Area" value={record.area.label} />}
        <Fact icon={<Trophy size={15} />} label="Official 100%" value={triLabel(record.officialCompletion, "Counts", "Doesn't count")} />
        <Fact icon={<Sparkles size={15} />} label="Unique" value={record.uniqueExperience ? "One of a kind" : "Not unique"} />
      </dl>

      {record.money && (
        <div className="mt-4 rounded-2xl border border-rule bg-panel/60 p-3.5">
          <p className="eyebrow text-gold">Money</p>
          <p className="mt-1.5 text-[0.95rem] text-ivory">
            {record.money.payout
              ? `${formatCash(record.money.payout.min)}${record.money.payout.max !== record.money.payout.min ? `–${formatCash(record.money.payout.max)}` : ""}`
              : "Payout not documented"}
            <span className="text-ivory-3">
              {" · "}
              {record.money.repeatability === "unknown" ? "repeatability unconfirmed" : record.money.repeatability.replace("-", " ")}
              {" · "}
              {record.money.risk === "unknown" ? "risk unconfirmed" : `${record.money.risk} risk`}
            </span>
          </p>
          {record.money.payout?.note && <p className="mt-1 text-[0.8125rem] text-ivory-3">{record.money.payout.note}</p>}
          {record.money.cooldownNote && <p className="mt-1 text-[0.8125rem] text-ivory-3">{record.money.cooldownNote}</p>}
        </div>
      )}

      {record.tips.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow text-ivory-3">Tips</p>
          <ul className="mt-2 space-y-2">
            {record.tips.map((tip) => (
              <li key={tip} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-ivory-2">
                <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-gold" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-5 text-[0.8125rem] leading-snug text-ivory-3">
        {CONFIDENCE_LABEL[record.confidence]} · {sourceLine(record)}
      </p>
    </Sheet>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-panel/70 px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-[0.75rem] uppercase tracking-wider text-ivory-3">
        <span aria-hidden>{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-[0.9rem] text-ivory">{value}</dd>
    </div>
  );
}
