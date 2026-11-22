"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGuide } from "@/components/guide/guide-provider";
import { useActions } from "@/components/shell/actions-provider";
import { LINK_CHECKPOINTS } from "./checkpoints";

/**
 * Applies a catch-up link (`/catch-up?to=<opaque id>`): marks the story
 * missions required through that point as done, then returns Home.
 * Optional content is never touched.
 */
export function CatchUpScreen() {
  const { state, apply } = useGuide();
  const { notify } = useActions();
  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!state || started.current) return;
    started.current = true;
    const to = new URLSearchParams(window.location.search).get("to");
    const checkpoint = LINK_CHECKPOINTS.find((c) => c.id === to);
    void (async () => {
      if (!checkpoint) {
        setFailed(true);
        return;
      }
      const ok = await apply(
        { type: "mark-records", recordIds: checkpoint.storyIds, mark: "complete", via: "onboarding" },
        checkpoint.label,
      );
      if (!ok) {
        setFailed(true);
        return;
      }
      if (state.onboarding.status !== "complete") {
        await apply({ type: "set-onboarding", status: "complete", reportedMilestone: checkpoint.label }, "Finished setup");
      }
      notify("Progress updated", true);
      router.replace("/");
    })();
  }, [state, apply, notify, router]);

  return (
    <main className="page">
      <div className="mt-24 text-center">
        {failed ? (
          <>
            <p className="headline text-[1.6rem] text-ivory">That link didn&apos;t work.</p>
            <p className="mt-2 text-[0.95rem] text-ivory-3">Nothing was changed.</p>
            <Link href="/" className="tap mt-6 inline-flex min-h-11 items-center text-sea">
              Go to the guide
            </Link>
          </>
        ) : (
          <p className="headline text-[1.6rem] text-ivory">Updating your progress…</p>
        )}
      </div>
    </main>
  );
}
