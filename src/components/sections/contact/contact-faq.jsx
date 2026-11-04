import React from "react";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export const CONTACT_FAQS = [
  {
    id: "contact-faq-1",
    question: "What is the fastest way to get support for the meelTe app?",
    answer:
      "For app questions, account support, or technical issues, email our team at support@meelTe.com or call our phone helpline (+91 88845 24444) during working hours (Monday to Friday, 9:00 AM to 6:00 PM IST).",
  },
  {
    id: "contact-faq-2",
    question: "How can local merchants request in-person onboarding?",
    answer:
      "Local shop owners can submit their details through our contact form or our merchant page. A representative from our field acquisition team will visit your store in person to set up your profile and help digitise your catalogue.",
  },
  {
    id: "contact-faq-3",
    question: "How do I report inappropriate content or request account deletion?",
    answer:
      "You can report listings and block users directly within the app chat. To delete your account or submit a privacy data request, email support@meelTe.com or use our web account deletion tool.",
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
      className="py-12 sm:py-16 lg:py-20 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-canvas px-3.5 py-1.5 shadow-2xs mb-3 sm:mb-3.5">
            <span className="flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-foreground">
              Frequently Asked Questions
            </span>
          </div>
          <h2
            id="contact-faq-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight text-balance"
          >
            Quick answers before you reach out.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Find immediate clarification on app help, merchant onboarding visits, response times, and account safety.
          </p>
        </div>

        <FaqAccordion items={CONTACT_FAQS} />

      </Container>
    </section>
  );
}

export default ContactFaq;
