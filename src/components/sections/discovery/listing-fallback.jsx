import { Container } from "@/components/layout/container";

/**
 * Shared skeleton fallback for discovery listings.
 *
 * @param {Object} props
 * @param {string} [props.label="Loading discovery content"] - Descriptive label for aria-busy announcement.
 */
export function ListingFallback({ label = "Loading discovery content" }) {
  return (
    <section
      aria-busy="true"
      aria-label={label}
      className="border-b border-border/80 bg-canvas py-8 sm:py-12 lg:py-16"
    >
      <Container>
        <div className="h-9 w-64 animate-pulse rounded-lg bg-surface-muted" aria-hidden="true" />
        <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-lg bg-surface-muted" aria-hidden="true" />
      </Container>
    </section>
  );
}

