/**
 * Compact numbered instruction strip shared by the offer and event detail pages.
 *
 * Both surfaces explain the same three beats — open the app, the shop or host
 * confirms, settle in person — so the markup lives here instead of being copied.
 *
 * There is deliberately no card around it (AVOID.md §2): the steps annotate the
 * action directly above them, and a third bordered box on the page only competes
 * with the content it is meant to explain. A hairline rule and small numerals
 * carry the grouping instead.
 */
export function DetailSteps({ id, title, steps = [], footnote }) {
  if (!steps.length) return null;

  return (
    <section aria-labelledby={id} className="mt-8 border-t border-border/80 pt-5">
      <h2 id={id} className="text-sm font-semibold text-foreground">
        {title}
      </h2>

      <ol className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[11px] font-bold text-primary"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="mt-0.5 text-xs leading-5 text-foreground-secondary">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      {footnote ? (
        <p className="mt-4 text-xs leading-5 text-foreground-secondary">{footnote}</p>
      ) : null}
    </section>
  );
}

export default DetailSteps;
