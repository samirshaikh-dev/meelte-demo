import React from "react";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
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
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight text-balance"
          >
            Frequently asked questions about support.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Quick answers before you reach out about app help, merchant visits, response times, and account safety.
          </p>
        </div>

        <FaqAccordion items={CONTACT_FAQS} />
      </Container>
    </section>
  );
}

export default ContactFaq;
