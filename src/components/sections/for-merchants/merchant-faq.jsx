import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { SUPPORT_EMAIL } from "@/config/site";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export const MERCHANT_FAQS = [
  {
    id: "merchant-faq-1",
    question: "How can a local business list on meelTe, and what does it cost?",
    answer:
      "Local shops, restaurants, and service businesses can enquire through the merchant desk and are onboarded in person by meelTe's field team. Merchant pricing details are handled directly during onboarding.",
  },
  {
    id: "merchant-faq-2",
    question: "What can a local business post on meelTe?",
    answer:
      "A business can publish a single-product ad or a shop catalogue of up to 100 products. Listings can show original and final prices or flat and percentage discounts, complete with clear start and end dates.",
  },
  {
    id: "merchant-faq-3",
    question: "How does catalogue creation from a menu photo work?",
    answer:
      "You can photograph a physical menu or price list to import item names and prices automatically, review the details, and add product images before publishing.",
  },
  {
    id: "merchant-faq-4",
    question: "Does meelTe charge commissions on in-store sales?",
    answer:
      "No. meelTe charges 0% commission on customer sales. Customers visit your store or connect with you directly, and all payments are settled directly between you and the customer.",
  },
  {
    id: "merchant-faq-5",
    question: "Can merchants track views or footfall analytics?",
    answer:
      "meelTe displays direct engagement metrics like likes and comments. The platform does not currently provide external footfall tracking or complex analytics dashboards.",
  },
];

export function getMerchantFaqJsonLd() {
  return getFaqPageJsonLd(MERCHANT_FAQS);
}

/**
 * Dedicated For-Merchants FAQ Section.
 * Tailored specifically for store owners and local business operators inquiring about
 * onboarding, menu photo tools, zero commission, and catalogue mechanics.
 */
export function MerchantFaq() {
  return (
    <section
      id="merchant-faq"
      aria-labelledby="merchant-faq-heading"
      className="py-16 sm:py-24 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2
            id="merchant-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight"
          >
            Questions about listing your business?
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Find out what you can publish, how photo catalogue creation works, and how customer purchases are settled.
          </p>
        </div>

        <FaqAccordion items={MERCHANT_FAQS} />

        <div className="mt-12 text-center p-6 rounded-3xl bg-canvas border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-sm font-bold text-foreground block">
              Ready to showcase your shop to nearby residents?
            </span>
            <span className="text-xs text-foreground-secondary">
              Our merchant onboarding team will help you get listed.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=meelTe%20Merchant%20Listing%20Inquiry`}
              className="rounded text-xs font-bold text-primary hover:underline px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              Email merchant desk
            </a>
            <a
              href="#merchant-enquiry"
              className="text-xs font-bold text-foreground bg-surface hover:bg-surface-subtle border border-border px-3.5 py-2 rounded-xl transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              Enquire now
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default MerchantFaq;

