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
  { label: "Discover Nearby", href: "/discover", icon: Compass },
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
      <Container className="relative z-10 w-full max-w-[95rem] 2xl:max-w-[100rem]">
        <div className="mx-auto w-full text-center">
          <div className="relative mb-6">
            <span className="inline-block text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-extrabold tracking-tighter bg-gradient-to-br from-primary via-primary-hover to-primary-royal bg-clip-text text-transparent leading-none drop-shadow-sm">
              404
            </span>
            <div className="absolute inset-x-0 -bottom-6 mx-auto h-1 w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Lost in the neighborhood
          </h1>
          <p className="text-lg text-foreground-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
            Looks like this page wandered off. Let&apos;s get you back to discovering
            local opportunities, events, and businesses near you.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
            <Button asChild size="lg" className="shadow-card hover:shadow-lg transition-shadow">
              <Link href="/">
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Go to Homepage</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="hover:shadow-md transition-shadow">
              <Link href="/discover">
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>Explore Nearby</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover:shadow-md transition-shadow">
              <Link href="/contact">
                <span>Contact Us</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mb-10">
            <p className="text-sm font-medium text-foreground-secondary mb-4">Or try these pages</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border/80 text-sm text-foreground-secondary hover:text-primary hover:border-primary/40 hover:bg-surface-muted transition-all"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <Card className="mx-auto max-w-2xl p-6 sm:p-8 text-left shadow-soft border-primary/15 bg-gradient-to-br from-surface to-surface-subtle hover:shadow-card transition-shadow">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-soft flex items-center justify-center">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Find what matters near you
                </h2>
                <p className="text-base text-foreground-secondary leading-relaxed mb-4">
                  Meelte connects you with local businesses, community events, and
                  opportunities right in your neighborhood — all in one place.
                </p>
                <Button
                  as="a"
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="md"
                  className="shadow-soft hover:shadow-md transition-shadow"
                >
                  <span>Get the Meelte App</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
