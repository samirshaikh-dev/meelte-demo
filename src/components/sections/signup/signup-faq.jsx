import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ArrowRight } from "@/lib/icons";
import { SUPPORT_EMAIL } from "@/config/site";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";

export const SIGNUP_FAQS = [
  {
    id: "signup-faq-1",
    question: "Where can I download the meelTe app?",
    answer:
      "The official meelTe app is published on Google Play for Android and on the App Store for iPhone.",
  },
  {
    id: "signup-faq-2",
    question: "Is meelTe free to join and use?",
    answer:
      "Yes. Downloading the meelTe app and browsing nearby offers and community events is completely free. There are no subscription fees or in-app purchase requirements.",
  },
  {
    id: "signup-faq-3",
    question: "How do meelTe referral coins and Amazon vouchers work?",
    answer:
      "Eligible sign-ups through an invite code receive a 30-coin welcome bonus, and you earn 30 coins for each friend who joins using your code. Once your profile is complete, coins can be redeemed for a ₹100 or ₹500 Amazon voucher (subject to a ₹500 lifetime redemption cap) delivered by email within seven business days.",
  },
  {
    id: "signup-faq-4",
    question: "What are the age and safety guidelines for meelTe?",
    answer:
      "meelTe is designed for users aged 13 and older. The app includes active moderation, user reporting tools, and chat blocking features to keep interactions respectful.",
  },
];

export function getSignupFaqJsonLd() {
  return getFaqPageJsonLd(SIGNUP_FAQS);
}

/**
 * Dedicated Signup Page FAQ Section.
 * Tailored for onboarding objections: app availability, free model, referral incentives, and trust & safety.
 */
export function SignupFaq() {
  return (
    <section
      id="signup-faq"
      aria-labelledby="signup-faq-heading"
      className="py-8 sm:py-12 lg:py-14 bg-surface scroll-mt-20 border-b border-border/80"
    >
      <Container className="max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2
            id="signup-faq-heading"
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-foreground leading-tight"
          >
            Questions people ask before installing.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
            Where to get the app, what is free, how referral rewards work, and how user safety is protected.
          </p>
        </div>

        <FaqAccordion items={SIGNUP_FAQS} />

        <div className="mt-5 sm:mt-6 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
          >
            <span>See all questions</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 sm:mt-8 text-center p-4 sm:p-5 rounded-2xl bg-canvas border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-sm font-bold text-foreground block">
              Have questions about signing up or your account?
            </span>
            <span className="text-xs text-foreground-secondary">
              Contact our support team for quick assistance.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=meelTe%20Signup%20Inquiry`}
              className="rounded text-xs font-bold text-primary hover:underline px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
            >
              Contact support
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

export default SignupFaq;

