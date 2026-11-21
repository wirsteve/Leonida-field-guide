/** Home masthead: the strategy-guide cover line. */
export function Masthead({ chapterLabel }: { chapterLabel: string | null }) {
  return (
    <header className="pb-6 pt-4">
      <div className="flex items-end justify-between gap-4">
        <h1 className="headline text-[2.15rem] leading-[0.92] text-ivory">
          <span className="block">Leonida</span>
          <span className="block italic text-gold">Field Guide</span>
        </h1>
        <CompassMark />
      </div>
      <p className="eyebrow mt-3 text-ivory-3">Your personal playthrough</p>
      <div className="mt-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-rule-strong" aria-hidden />
        <p className="eyebrow text-sea">{chapterLabel ? `${chapterLabel} · Current progress` : "Setting up your guide"}</p>
        <span className="h-px w-6 bg-rule-strong" aria-hidden />
      </div>
    </header>
  );
}

/** A small, original chart-compass mark (no third-party artwork). */
function CompassMark() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="shrink-0 opacity-90">
      <circle cx="22" cy="22" r="20.5" fill="none" stroke="currentColor" className="text-rule-strong" />
      <circle cx="22" cy="22" r="14" fill="none" stroke="currentColor" strokeDasharray="1.5 3" className="text-ivory-3" />
      <path d="M22 5 L25 22 L22 39 L19 22 Z" className="fill-coral" />
      <path d="M22 5 L25 22 L19 22 Z" className="fill-gold" opacity="0.9" />
      <circle cx="22" cy="22" r="2" className="fill-ivory" />
    </svg>
  );
}

/** Section page header for the non-Home tabs. */
export function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <header className="pb-5 pt-4">
      <p className="eyebrow text-sea">{eyebrow}</p>
      <h1 className="headline mt-2 text-[2rem] leading-[1.02] text-ivory">{title}</h1>
      {lede && <p className="mt-3 max-w-[34ch] text-[0.975rem] leading-relaxed text-ivory-2">{lede}</p>}
    </header>
  );
}
