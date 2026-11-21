"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, EyeOff } from "lucide-react";
import type { IdentifyResponse, ProgressMark, PublicGuideRecord } from "@/contracts";
import { guideClient } from "@/components/guide/guide-client";
import { useGuide } from "@/components/guide/guide-provider";
import { KIND_LABEL } from "@/components/guide/labels";
import { Button } from "@/components/ui/primitives";
import { cx } from "@/components/ui/cx";
import { CHECKPOINTS, type Checkpoint } from "./checkpoints";

type Step = "welcome" | "story" | "optional" | "cash" | "done";
const STEPS: Step[] = ["welcome", "story", "optional", "cash", "done"];

export function OnboardingScreen() {
  const [step, setStep] = useState<Step>("welcome");
  const index = STEPS.indexOf(step);
  const next = () => setStep(STEPS[Math.min(index + 1, STEPS.length - 1)]);
  const back = () => setStep(STEPS[Math.max(index - 1, 0)]);

  return (
    <main className="page">
      <div className="flex items-center justify-between pb-2 pt-3">
        {index > 0 && step !== "done" ? (
          <button type="button" onClick={back} className="tap -ml-2 flex min-h-11 items-center gap-1 rounded-full px-2 text-[0.9rem] text-ivory-2">
            <ArrowLeft size={18} aria-hidden /> Back
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-1.5" aria-label={`Step ${index + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <span key={s} className={cx("h-1 w-6 rounded-full", i <= index ? "bg-gold" : "bg-ivory/12")} />
          ))}
        </div>
      </div>

      <div key={step} className="rise-in">
        {step === "welcome" && <Welcome onNext={next} />}
        {step === "story" && <StoryStep onNext={next} />}
        {step === "optional" && <OptionalStep onNext={next} />}
        {step === "cash" && <CashStep onNext={next} />}
        {step === "done" && <Done />}
      </div>
    </main>
  );
}

function Title({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="pb-5 pt-6">
      <p className="eyebrow text-sea">{eyebrow}</p>
      <h1 className="headline mt-2 text-[2rem] leading-[1.05] text-ivory text-balance">{title}</h1>
      {children && <div className="mt-3 text-[1rem] leading-relaxed text-ivory-2">{children}</div>}
    </header>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  const { apply, state } = useGuide();
  return (
    <>
      <Title eyebrow="Setup" title="Let's find your place in the story">
        <p>A few quick questions so the guide knows what you&apos;ve done. You can change any answer later in the Journal.</p>
      </Title>
      <div className="space-y-3">
        <Promise icon={<EyeOff size={18} />} text="You'll only ever see things you've already reached. No future names, places or totals." />
        <Promise icon={<Check size={18} />} text="Nothing optional is marked done unless you say so. 'Not sure' is always an option." />
      </div>
      <Button
        variant="primary"
        size="lg"
        className="mt-8 w-full"
        onClick={async () => {
          if (state?.onboarding.status !== "complete") await apply({ type: "set-onboarding", status: "in-progress" }, "Started setup");
          onNext();
        }}
      >
        Start <ArrowRight size={18} aria-hidden />
      </Button>
    </>
  );
}

function Promise({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-rule bg-panel/60 p-4">
      <span className="mt-0.5 text-gold" aria-hidden>
        {icon}
      </span>
      <p className="text-[0.95rem] leading-relaxed text-ivory-2">{text}</p>
    </div>
  );
}

function StoryStep({ onNext }: { onNext: () => void }) {
  const { snapshot, apply } = useGuide();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<IdentifyResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function identify() {
    if (!snapshot || !query.trim()) return;
    setBusy(true);
    setError(false);
    try {
      setResult(await guideClient.identify(snapshot, query.trim()));
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function startFrom(checkpoint: Checkpoint) {
    setBusy(true);
    const ok = await apply(
      { type: "mark-records", recordIds: checkpoint.storyIds, mark: "complete", via: "onboarding" },
      `Setup: ${checkpoint.label.toLowerCase()}`,
    );
    if (ok) {
      await apply({ type: "set-onboarding", status: "in-progress", reportedMilestone: checkpoint.label }, "Recorded your starting point");
      onNext();
    }
    setBusy(false);
  }

  async function confirm() {
    if (!result?.matched) return;
    const ok = await apply(
      { type: "mark-records", recordIds: result.impliedComplete, mark: "complete", via: "onboarding" },
      `Setup: story up to ${result.matched.name}`,
    );
    if (ok) {
      await apply({ type: "set-onboarding", status: "in-progress", reportedMilestone: query.trim() }, "Recorded your latest milestone");
      onNext();
    }
  }

  return (
    <>
      <Title eyebrow="Story progress" title="Where are you in the story?">
        <p>Pick your starting point. You can fine-tune anything afterwards.</p>
      </Title>
      <ul className="space-y-2">
        {CHECKPOINTS.map((checkpoint) => (
          <li key={checkpoint.id}>
            <button
              type="button"
              disabled={busy}
              onClick={() => startFrom(checkpoint)}
              className="tap flex min-h-16 w-full items-center gap-3 rounded-2xl border border-rule-strong bg-panel/70 p-4 text-left hover:bg-panel-2 disabled:opacity-50"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[1.05rem] font-medium text-ivory">{checkpoint.label}</span>
                <span className="mt-0.5 block text-[0.8125rem] text-ivory-3">{checkpoint.detail}</span>
              </span>
              <ArrowRight size={20} className="shrink-0 text-gold" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <p className="eyebrow mb-3 mt-8 text-ivory-3">Or type the last mission you finished</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void identify();
        }}
      >
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setResult(null);
          }}
          aria-label="Last story mission you finished"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="go"
          className="h-14 w-full rounded-2xl border border-rule-strong bg-panel px-4 text-[1.05rem] text-ivory focus:border-gold/60 focus:outline-none"
        />
        <Button type="submit" variant="quiet" size="lg" className="mt-3 w-full" disabled={busy || !query.trim()}>
          {busy ? "Looking…" : "Find it"}
        </Button>
      </form>
      <p className="mt-2 text-[0.8125rem] text-ivory-3">No suggestions appear while you type. That&apos;s deliberate, so nothing ahead of you is shown.</p>

      {error && <p className="mt-4 text-[0.9rem] text-flare">Couldn&apos;t reach the guide. Check your connection and try again.</p>}

      {result?.matched && (
        <div className="mt-6 rounded-[1.4rem] bg-sea/10 p-5 ring-1 ring-inset ring-sea/35">
          <p className="eyebrow text-sea">Found it</p>
          <p className="headline mt-2 text-[1.6rem] leading-tight text-ivory">
            {/^(continue the story|story mission|spoiler)$/i.test(result.matched.name) ? `“${query.trim()}”` : result.matched.name}
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory-2">
            This marks it and the {result.impliedComplete.length - 1} story missions before it as complete. Optional content stays unrecorded until you confirm it.
          </p>
          <Button variant="primary" size="lg" className="mt-4 w-full" onClick={confirm}>
            That&apos;s right, continue
          </Button>
        </div>
      )}
      {result && !result.matched && (
        <div className="mt-6 rounded-[1.4rem] border border-rule-strong bg-panel/60 p-5">
          <p className="text-[1rem] text-ivory">We couldn&apos;t confirm that name.</p>
          <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ivory-3">
            Check the spelling against the mission title shown in game, or skip this. The guide will start from the beginning and you can mark missions as you go.
          </p>
        </div>
      )}

      <button type="button" onClick={onNext} className="mt-6 min-h-11 w-full text-center text-[0.9rem] text-ivory-3 hover:text-ivory-2">
        Skip for now
      </button>
    </>
  );
}

const OPTIONAL_KINDS = new Set<PublicGuideRecord["kind"]>(["side-mission", "activity", "race", "encounter", "contact", "location", "vehicle", "equipment"]);

function OptionalStep({ onNext }: { onNext: () => void }) {
  const { evaluation, apply, state } = useGuide();
  // Optional content, plus story steps whose names are safe to show (side errands
  // the identify step can't infer). Withheld story missions are never listed.
  const items = (evaluation?.records ?? []).filter(
    (r) => r.status !== "closed" && (OPTIONAL_KINDS.has(r.kind) || (r.kind === "story-mission" && !r.nameWithheld && r.status !== "completed")),
  );

  async function set(record: PublicGuideRecord, mark: ProgressMark) {
    if (record.kind === "contact" || record.kind === "location") {
      await apply({ type: "set-discovered", recordId: record.id, discovered: mark === "complete" }, `${mark === "complete" ? "Discovered" : "Not yet"}: ${record.name}`);
      if (mark !== "complete") return;
    }
    await apply({ type: "mark-record", recordId: record.id, mark, via: "onboarding" }, `Setup: ${record.name}`);
  }

  return (
    <>
      <Title eyebrow="Side content" title="Which of these have you done?">
        <p>Only things you could already have reached are listed. Leave anything you&apos;re unsure about as &ldquo;Not sure&rdquo;.</p>
      </Title>
      {items.length === 0 && (
        <p className="rounded-2xl border border-rule bg-panel/60 p-4 text-[0.95rem] text-ivory-3">Nothing to reconcile at this point.</p>
      )}
      <ul className="space-y-2">
        {items.map((r) => {
          const mark = state?.marks[r.id]?.mark;
          return (
            <li key={r.id} className="rounded-2xl border border-rule bg-panel/60 p-3.5">
              <p className="text-[1rem] text-ivory">{r.name}</p>
              <p className="text-[0.75rem] text-ivory-3">{KIND_LABEL[r.kind]}</p>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5" role="radiogroup" aria-label={r.name}>
                {(
                  [
                    ["complete", r.kind === "contact" ? "Met" : "Done"],
                    ["incomplete", "Not yet"],
                    ["unsure", "Not sure"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={mark === value}
                    onClick={() => set(r, value)}
                    className={cx(
                      "tap min-h-11 rounded-xl text-[0.875rem]",
                      mark === value
                        ? value === "complete"
                          ? "bg-sea font-semibold text-ink"
                          : value === "unsure"
                            ? "bg-gold/20 font-semibold text-gold ring-1 ring-inset ring-gold/40"
                            : "bg-ivory/14 font-semibold text-ivory"
                        : "bg-ink/40 text-ivory-2 ring-1 ring-inset ring-rule",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <Button variant="primary" size="lg" className="mt-8 w-full" onClick={onNext}>
        Continue <ArrowRight size={18} aria-hidden />
      </Button>
    </>
  );
}

function CashStep({ onNext }: { onNext: () => void }) {
  const { apply, state } = useGuide();
  const [cash, setCash] = useState(state?.cash.amount?.toString() ?? "");
  return (
    <>
      <Title eyebrow="Money" title="How much cash do you have?">
        <p>Optional. It helps the guide judge whether grinding is worth your time.</p>
      </Title>
      <div className="relative">
        <span className="headline pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gold" aria-hidden>
          $
        </span>
        <input
          inputMode="numeric"
          aria-label="Cash on hand"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          placeholder="0"
          className="headline h-16 w-full rounded-2xl border border-rule-strong bg-panel pl-9 pr-4 text-[1.75rem] text-ivory placeholder:text-ivory-3/50 focus:border-gold/60 focus:outline-none"
        />
      </div>
      <Button
        variant="primary"
        size="lg"
        className="mt-8 w-full"
        onClick={async () => {
          const value = cash.replace(/[$,\s]/g, "");
          if (/^\d+$/.test(value)) await apply({ type: "set-cash", amount: Number(value) }, "Recorded cash");
          onNext();
        }}
      >
        {cash.trim() ? "Save and finish" : "Skip and finish"}
      </Button>
    </>
  );
}

function Done() {
  const { apply, state } = useGuide();
  const router = useRouter();
  return (
    <>
      <Title eyebrow="All set" title="Your guide is ready">
        <p>Home now shows your next best move. Mark things complete as you play and the plan adapts.</p>
      </Title>
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={async () => {
          await apply(
            { type: "set-onboarding", status: "complete", reportedMilestone: state?.onboarding.reportedMilestone },
            "Finished setup",
          );
          router.push("/");
        }}
      >
        Open my guide <ArrowRight size={18} aria-hidden />
      </Button>
      <Link href="/journal" className="mt-3 flex min-h-11 items-center justify-center text-[0.9rem] text-ivory-3">
        Review in Journal
      </Link>
    </>
  );
}
