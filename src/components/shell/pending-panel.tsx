/**
 * Foundation placeholder. States plainly that a module is not connected yet,
 * instead of rendering fake recommendations.
 */
export function PendingPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="chart-grid rounded-[var(--radius-card)] border border-rule bg-panel/70 p-5">
      <p className="eyebrow text-gold">In progress</p>
      <h2 className="headline mt-2 text-xl text-ivory">{title}</h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory-2">{body}</p>
    </section>
  );
}
