import React from "react";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
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
      className="py-8 sm:py-12 lg:py-14 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2
            id="merchant-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight text-balance"
          >
            Questions about listing your business?
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Find out what you can publish, how photo catalogue creation works, and how customer purchases are settled.
          </p>
        </div>

        <FaqAccordion items={MERCHANT_FAQS} />
      </Container>
    </section>
  );
}

export default MerchantFaq;

