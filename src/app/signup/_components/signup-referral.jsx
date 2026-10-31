import React from "react";
import { Gift, ShieldCheck } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * Referral facts for /signup.
 *
 * Every figure comes from the product's referral scheme as audited in
 * docs/target_customer.md §1 ("Growth & rewards"): a 30-coin signup bonus,
 * 30 coins per referred friend, milestones at 10 / 50 / 100 invites, redemption
 * as a ₹100 or ₹500 Amazon voucher, a ₹500 lifetime cap, and a 7-business-day
 * email delivery window.
 *
 * Presented as facts, never as income: no earnings, totals, guaranteed rewards
 * or "unlimited" claim appears here, and nothing is promised for this website —
 * coins live in the app and are not tracked or redeemed on the web.
 */
const REFERRAL_FACTS = [
  { value: "30 coins", label: "when you create your account" },
  { value: "+30 coins", label: "for every friend who joins with your code" },
  {
    value: "₹100 or ₹500",
    label: "Amazon voucher options once your profile is complete",
  },
  { value: "₹500", label: "lifetime cap per user" },
];

export function SignupReferral() {
  return (
    <section
      aria-labelledby="signup-referral-heading"
      className="border-b border-border/80 bg-surface py-14 sm:py-20"
    >
      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3 gap-1.5">
            <Gift className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Refer &amp; Earn</span>
          </Badge>

          <h2
            id="signup-referral-heading"
            className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Bring your friends in. Collect coins.
          </h2>
        </div>

        <div className="mt-10 rounded-3xl border border-primary/20 bg-canvas p-6 shadow-soft sm:mt-12 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div>
              <p className="text-base leading-relaxed text-foreground-secondary">
                Every new account starts with 30 coins, and each friend who joins
                with your referral code adds 30 more. Milestones land at 10, 50 and
                100 invites.
              </p>

              <p className="mt-5 flex gap-2.5 border-t border-border/70 pt-5 text-sm leading-relaxed text-foreground-secondary">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                Vouchers are emailed within 7 business days. Coins and vouchers
                are handled inside the app. This website does not track or redeem
                them.
                </span>
              </p>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              {REFERRAL_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-border/80 bg-surface p-4"
                >
                  <dt className="text-2xl font-black tracking-tight text-foreground">
                    {fact.value}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SignupReferral;
