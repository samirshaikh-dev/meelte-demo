import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/lib/icons";

const CONTACT_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact Us" },
];

export function ContactHero() {
  return (
    <section className="border-b border-primary/10 bg-surface">
      <Container className="max-w-6xl py-10 sm:py-14 lg:py-16">
        <div className="max-w-3xl">
          <Breadcrumbs items={CONTACT_BREADCRUMBS} className="mb-7" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            How can we help?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
            Get in touch about app support, a local business, a community event,
            or feedback. Choose the route that works best for you.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button as="a" href="#contact-form" variant="primary" size="pill">
              Write to our team
            </Button>
            <Button
              as={Link}
              href="/faq"
              variant="outline"
              size="pill"
              className="group"
            >
              Browse FAQs
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ContactHero;
