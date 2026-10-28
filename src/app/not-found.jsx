import Link from "next/link";
import Container from "../components/layout/container.jsx";
import Button from "../components/ui/button.jsx";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center bg-canvas">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block text-primary text-7xl md:text-8xl font-extrabold mb-4">
            404
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-foreground-secondary mb-10 leading-relaxed">
            The page you are looking for does not exist or has been moved. Let us
            get you back to discovering opportunities in your neighborhood.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Button asChild size="lg">
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/jobs">Browse Local Jobs</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
