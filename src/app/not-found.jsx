import Link from "next/link";
import { Compass, Home, Search, ArrowRight, MapPin } from "@/lib/icons";
import { Container } from "../components/layout/container.jsx";
import { Button } from "../components/ui/button.jsx";
import { Card } from "../components/ui/card.jsx";
import { PLAY_STORE_URL } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Page Not Found | Meelte",
  description:
    "The page you are looking for does not exist or has been moved. Discover local opportunities, events, and businesses near you with Meelte.",
  path: "/404",
  robots: {
    index: false,
    follow: false,
  },
});

const SUGGESTED_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "How It Works", href: "/how-it-works", icon: MapPin },
  { label: "Contact Us", href: "/contact", icon: ArrowRight },
];

export default function NotFound() {
  return (
    <section className="relative min-h-[calc(100vh-140px)] flex items-center bg-canvas overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-canvas to-canvas" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-20 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/5 blur-3xl" />
      </div>
      <Container className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full text-center">
          <div className="relative mb-5">
            <span className="inline-block text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-extrabold tracking-tighter bg-gradient-to-br from-primary via-primary-hover to-primary-royal bg-clip-text text-transparent leading-none drop-shadow-sm">
              404
            </span>
            <div className="absolute inset-x-0 -bottom-5 mx-auto h-1 w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Lost in the neighborhood
          </h1>
          <p className="text-base text-foreground-secondary mb-8 leading-relaxed max-w-xl mx-auto">
            Looks like this page wandered off. Let&apos;s get you back to discovering
            local opportunities, events, and businesses near you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <Button asChild size="lg" className="shadow-card hover:shadow-lg transition-shadow">
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Go to Homepage</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="hover:shadow-md transition-shadow">
              <Link href="/discover" className="inline-flex items-center gap-2">
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>Explore Nearby</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover:shadow-md transition-shadow">
              <Link href="/contact" className="inline-flex items-center gap-2">
                <span>Contact Us</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

      <Card className="mx-auto w-full max-w-3xl p-5 sm:p-6 text-left shadow-soft border-primary/15 bg-gradient-to-br from-surface to-surface-subtle hover:shadow-card transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-foreground mb-1.5">
                  Find what matters near you
                </h2>
                <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
                  Meelte connects you with local businesses, community events, and
                  opportunities right in your neighborhood — all in one place.
                </p>
              </div>
              <Button
                as="a"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="md"
                className="shadow-soft hover:shadow-md transition-shadow inline-flex items-center gap-2 shrink-0 self-start sm:self-center"
              >
                <span>Get the Meelte App</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
