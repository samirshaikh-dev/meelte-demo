import {
  CalendarDays,
  Lock,
  MessageSquare,
  Tag,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";

const EXPERIENCES = [
  {
    id: "offers",
    title: "Local shop offers",
    icon: Tag,
    description:
      "Find nearby discounts sorted by distance. See start/end dates, rupee savings, and get one-tap directions in Google Maps.",
  },
  {
    id: "events",
    title: "Community events",
    icon: CalendarDays,
    description:
      "Discover local meetups, workshops, and gatherings. Request to join alone or with a group, and hosts manage attendance.",
  },
  {
    id: "chat",
    title: "Direct 1:1 chat & calls",
    icon: MessageSquare,
    description:
      "Connect directly with friends, event hosts, and followed shops through built-in messaging and calls.",
  },
  {
    id: "privacy",
    title: "Location respect & privacy",
    icon: Lock,
    description:
      "Your location is used only to calculate proximity to nearby listings and verify active zones.",
  },
];

export function ProductExperienceSection() {
  return (
    <section
      id="product-tour"
      aria-labelledby="product-tour-heading"
      className="scroll-mt-20 border-b border-border/80 bg-surface py-8 sm:py-12 lg:py-14"
    >
      <Container>
        {/* Section Heading */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <h2
            id="product-tour-heading"
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.4rem] lg:leading-tight text-balance"
          >
            What you can do in the app.
          </h2>
        </div>

        {/* Compact 2x2 grid: static cards, so no hover or shadow implies clickability. */}
        <ul role="list" className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
          {EXPERIENCES.map((exp) => (
            <li key={exp.id} className="flex">
              <div className="flex w-full items-start gap-3.5 rounded-2xl border border-primary/15 bg-canvas p-4 sm:gap-4 sm:p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-surface text-primary">
                  <exp.icon className="h-5 w-5" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {exp.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                    {exp.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default ProductExperienceSection;
