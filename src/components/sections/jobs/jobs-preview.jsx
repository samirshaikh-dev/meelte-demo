import React from "react";
import { Briefcase, MapPin, Clock, ArrowRight, Building2, CheckCircle2 } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLAY_STORE_URL } from "@/config/site";

const SAMPLE_JOBS = [
  {
    id: "job-1",
    title: "Store Operations & Retail Supervisor",
    company: "Artisan Boutique Collective",
    city: "Bengaluru (Indiranagar)",
    type: "Full Time",
    posted: "Posted 2 days ago",
    salary: "₹25,000 – ₹35,000 / mo",
    badge: "Verified Local Store",
  },
  {
    id: "job-2",
    title: "Head Barista & Cafe Coordinator",
    company: "Roast & Toast Neighborhood Cafe",
    city: "Bengaluru (Koramangala)",
    type: "Full Time",
    posted: "Posted 3 days ago",
    salary: "₹20,000 – ₹28,000 / mo",
    badge: "Immediate Joining",
  },
  {
    id: "job-3",
    title: "Accounts & Inventory Executive",
    company: "Kisan Agro Supplies",
    city: "Gaya (Town Center)",
    type: "Full Time",
    posted: "Posted 4 days ago",
    salary: "₹18,000 – ₹24,000 / mo",
    badge: "Local Opportunity",
  },
  {
    id: "job-4",
    title: "Client Relations & Clinic Front Desk",
    company: "Sanjeevani Wellness Center",
    city: "Ranchi (Morabadi)",
    type: "Full Time",
    posted: "Posted 5 days ago",
    salary: "₹16,000 – ₹22,000 / mo",
    badge: "Healthcare",
  },
];

export function JobsPreview() {
  return (
    <section id="jobs" className="py-16 sm:py-24 bg-canvas scroll-mt-20">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <Badge variant="primary" className="mb-3">
              <Briefcase className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Hyper-Local Careers</span>
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Work close to home with verified local employers.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-foreground-secondary leading-relaxed">
              Find employment in neighborhood boutiques, cafes, clinics, and growing local enterprises. Apply in seconds with zero recruiting agency barriers.
            </p>
          </div>

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover group shrink-0"
          >
            <span>View all openings on Meelte App</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>

        {/* 4 Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {SAMPLE_JOBS.map((job) => (
            <Card key={job.id} hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="success" size="sm">
                    {job.badge}
                  </Badge>
                  <span className="text-xs text-foreground-secondary flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {job.posted}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
                  {job.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-foreground-secondary font-medium">
                  <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>{job.company}</span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground-secondary">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {job.city}
                  </span>
                  <span>•</span>
                  <span>{job.type}</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">{job.salary}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Direct employer hire
                </span>

                <Button
                  as="a"
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                  className="rounded-lg shadow-2xs"
                >
                  Apply on App
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* HR Recruiter Callout Strip */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-surface border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Hiring for your local business?</h4>
              <p className="text-xs text-foreground-secondary">
                Post jobs and access local candidate resumes directly through the Meelte employer hub.
              </p>
            </div>
          </div>
          <Button
            as="a"
            href={`mailto:hr@meelte.com?subject=Post%20a%20Local%20Job%20Opening`}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            Post an Opening →
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default JobsPreview;
