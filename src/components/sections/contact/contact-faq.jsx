import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ArrowRight } from "@/lib/icons";
import { SUPPORT_EMAIL } from "@/config/site";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export const CONTACT_FAQS = [
  {
    id: "contact-faq-1",
    question: "What is the fastest way to get support for the meelTe app?",
    answer:
      "For app questions, account support, or technical issues, email our team at support@meelTe.com or call our phone helpline during working hours (Monday to Saturday, 10:00 AM to 6:00 PM IST).",
  },
  {
    id: "contact-faq-2",
    question: "How can local merchants request in-person onboarding?",
    answer:
      "Local shop owners can submit their details through the Contact form or the merchant page. A representative from our field acquisition team will visit your store in person to set up your profile and help digitise your catalogue.",
  },
  {
    id: "contact-faq-3",
    question: "How do I report inappropriate content or request account deletion?",
    answer:
      "You can report listings and block users directly within the app chat. To delete your account or submit a privacy data request, email support@meelTe.com or use the web account deletion tool.",
  },
  {
    id: "contact-faq-4",
    question: "How quickly does the meelTe team respond?",
    answer:
      "Our team reviews inquiries and responds to form submissions and emails within 1 to 2 business days.",
  },
];

export function getContactFaqJsonLd() {
  return getFaqPageJsonLd(CONTACT_FAQS);
}

/**
 * Dedicated Contact Page FAQ Section.
 * Tailored for visitors looking for contact options, merchant onboarding visits,
 * support desk hours, and reporting procedures.
 */
export function ContactFaq() {
  return (
    <section
      id="contact-faq"
      aria-labelledby="contact-faq-heading"
      className="py-8 sm:py-12 lg:py-14 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2
            id="contact-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight"
          >
            Frequently asked questions about support.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Quick answers before you reach out about app help, merchant visits, response times, and account safety.
          </p>
        </div>

        <FaqAccordion items={CONTACT_FAQS} />

        <div className="mt-5 sm:mt-6 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
          >
            <span>See complete FAQ directory</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 sm:mt-8 text-center p-4 sm:p-5 rounded-2xl bg-canvas border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-sm font-bold text-foreground block">
              Prefer to talk to someone directly?
            </span>
            <span className="text-xs text-foreground-secondary">
              Use the contact details or the inquiry form above.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="rounded text-xs font-bold text-primary hover:underline px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              Email support
            </a>
            <Link
              href="/for-merchants"
              className="text-xs font-bold text-foreground bg-surface hover:bg-surface-subtle border border-border px-3.5 py-2 rounded-xl transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              Merchant desk
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ContactFaq;
