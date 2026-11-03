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
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.4rem] lg:leading-tight"
          >
            What you can do in the app.
          </h2>
        </div>

        {/* Responsive 2-Column Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {EXPERIENCES.map((exp) => {
            const Icon = exp.icon;

            return (
              <div
                key={exp.id}
                className="group rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-soft transition-all duration-200 hover:border-primary/30 hover:bg-surface-subtle/50 hover:shadow-card"
              >
                {/* Header: Icon tile alongside Title */}
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
                    {exp.title}
                  </h3>
                </div>

                {/* Description below */}
                <p className="mt-3.5 text-sm leading-relaxed text-foreground-secondary">
                  {exp.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default ProductExperienceSection;
