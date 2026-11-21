"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGuide } from "@/components/guide/guide-provider";
import { Masthead } from "@/components/shell/masthead";
import { StatusBanner } from "@/components/shell/status-banner";
import { SectionLabel, VerificationNote } from "@/components/ui/primitives";
import { NextMoveHero } from "./next-move-hero";
import { QuickActions } from "./quick-actions";
import { ReadinessPanel } from "./readiness-panel";
import { RouteQueue } from "./route-queue";
import { ExploreTeaser, MoneySnapshot } from "./snapshots";

export function HomeScreen() {
  const { evaluation, state } = useGuide();
  const onboarded = state?.onboarding.status === "complete";
  const queue = evaluation ? evaluation.queue.filter((q) => q.id !== evaluation.nextBestMove?.id && q.priority !== "wait" && q.kind !== "money").slice(0, 4) : [];

  return (
    <main className="page">
      <Masthead chapterLabel={evaluation?.stage?.chapterLabel ?? null} />
      <StatusBanner />

      {state && !onboarded && (
        <Link
          href="/onboarding"
          className="tap rise-in mb-5 flex items-center gap-4 rounded-[var(--radius-card)] bg-gold p-4 text-ink hover:bg-[#ebc27e]"
        >
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-ink/70">Start here</p>
            <p className="headline mt-1 text-[1.3rem] leading-tight">Tell the guide where you are</p>
            <p className="mt-1 text-[0.875rem] text-ink/75">Two minutes. Nothing ahead of you is shown.</p>
          </div>
          <ArrowRight size={22} aria-hidden />
        </Link>
      )}

      <QuickActions />

      <div id="next-move" className="mt-6 scroll-mt-4">
        {!evaluation && <HeroSkeleton />}
        {evaluation?.nextBestMove && <NextMoveHero move={evaluation.nextBestMove} />}
        {evaluation && !evaluation.nextBestMove && (
          <section className="rounded-[1.6rem] border border-rule bg-panel/70 p-5">
            <p className="eyebrow text-ivory-2">Your next best move</p>
            <p className="headline mt-3 text-[1.6rem] leading-tight">Nothing verified to recommend yet.</p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory-3">{evaluation.coverageNote}</p>
          </section>
        )}
      </div>

      {queue.length > 0 && (
        <div className="mt-8">
          <SectionLabel aside={<Link href="/strategy" className="text-[0.8125rem] text-sea">Full plan</Link>}>The route</SectionLabel>
          <RouteQueue items={queue} />
        </div>
      )}

      {evaluation && (
        <>
          <div className="mt-6">
            <SectionLabel>Advancement</SectionLabel>
            <ReadinessPanel readiness={evaluation.readiness} compact />
          </div>
          <div className="mt-8">
            <SectionLabel>Money</SectionLabel>
            <MoneySnapshot evaluation={evaluation} />
          </div>
          <div className="mt-8">
            <SectionLabel>Explore</SectionLabel>
            <ExploreTeaser evaluation={evaluation} />
          </div>
          <VerificationNote className="mt-8">{evaluation.coverageNote}</VerificationNote>
        </>
      )}
    </main>
  );
}

function HeroSkeleton() {
  return (
    <div className="h-[260px] animate-pulse rounded-[1.6rem] border border-rule bg-panel/60" aria-label="Loading your guide" role="status" />
  );
}
