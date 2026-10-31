import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BusinessAcquisitionSection } from "@/components/sections/home";
import { FaqSection } from "@/components/sections/common";
import { Container } from "@/components/layout/container";
import { Camera, MapPin, Tag } from "@/lib/icons";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { FAQ_ITEMS } from "@/constants/faq-constants";
import { getFaqPageJsonLd } from "@/lib/seo/structured-data";
import { APP_URL } from "@/config/site";
import { ForMerchantsHero } from "./_components/for-merchants-hero";

const MERCHANT_FAQ_IDS = new Set(["faq-3", "faq-5", "faq-8", "faq-11"]);
const MERCHANT_FAQS = FAQ_ITEMS.filter((faq) => MERCHANT_FAQ_IDS.has(faq.id));
const MERCHANT_FAQ_JSON_LD = getFaqPageJsonLd(MERCHANT_FAQS);

const MERCHANT_CAPABILITIES = [
  {
    icon: Camera,
    title: "Build a catalogue from a menu photo",
    description:
      "A shop ad can show up to 100 products. Photograph a menu or price list to import item names and prices, then review the details and add generated images for products you have not photographed.",
  },
  {
    icon: Tag,
    title: "Set a clear price and run period",
    description:
      "Publish a single-product offer or a shop catalogue. Choose original and final prices, a flat discount, or an up-to discount, then set the dates the ad should run.",
  },
  {
    icon: MapPin,
    title: "Help nearby residents find your shop",
    description:
      "Pin your shop location so residents can open directions in Google Maps. They can follow your shop and hear about updates to its offers.",
  },
];

/* ─────────────────────────────────────────────
   SEO Metadata — per seo-engineer SKILL.md
   Merchant-focused intent keywords.
───────────────────────────────────────────── */
export const metadata = buildPageMetadata({
  title: "List Your Shop on Meelte — 0% Commission Local Offers",
  description:
    "Promote your shop to nearby residents on Meelte with 0% commission. Publish a single offer or a catalogue of up to 100 items, with a price, a discount and a defined run of dates. Live in Bengaluru, Gaya & Ranchi.",
  path: "/for-merchants",
  keywords: [
    "list business on Meelte",
    "local business listing India",
    "zero commission food delivery alternative",
    "promote local business",
    "hyperlocal business listing",
    "shop listing near me",
    "grow local store",
    "Meelte for merchants",
    "0% commission business platform",
    "local business advertising Bengaluru",
    "neighborhood store promotion",
  ],
});

/* ─────────────────────────────────────────────
   JSON-LD — HowTo + Service + FAQPage + BreadcrumbList for AEO/GEO
───────────────────────────────────────────── */
function getForMerchantsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "@id": `${APP_URL}/for-merchants#howto`,
        name: "How to List Your Business on Meelte",
        description:
          "Promote a local shop to nearby residents with a time-boxed offer and no commission deducted.",
        url: `${APP_URL}/for-merchants`,
        step: [
          {
            "@type": "HowToStep",
            name: "Submit an enquiry",
            text: "Send your business name, category, phone number, and city, or call the merchant desk directly.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
          {
            "@type": "HowToStep",
            name: "Meet the field team",
            text: "A member of Meelte's field team visits the shop in person and sets up the profile.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
          {
            "@type": "HowToStep",
            name: "Publish your first offer",
            text: "Add a single product or a catalogue of up to 100 items with a price or discount and the dates it should run. It goes live at 12:00 AM on the start date.",
            url: `${APP_URL}/for-merchants#merchant-enquiry`,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${APP_URL}/for-merchants#service`,
        name: "Meelte Merchant Onboarding — Local Business Promotion",
        description:
          "Local business promotion for shops, cafes and service businesses: publish time-boxed offers to nearby residents. Meelte deducts no commission on a sale.",
        provider: {
          "@id": `${APP_URL}#organization`,
        },
        areaServed: [
          { "@type": "City", name: "Bengaluru" },
          { "@type": "City", name: "Gaya" },
          { "@type": "City", name: "Ranchi" },
        ],
        serviceType: "Local Business Promotion",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${APP_URL}/for-merchants#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: APP_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "For Merchants",
            item: `${APP_URL}/for-merchants`,
          },
        ],
      },
      ...(MERCHANT_FAQ_JSON_LD
        ? [
            {
              "@id": `${APP_URL}/for-merchants#faq`,
              "@type": MERCHANT_FAQ_JSON_LD["@type"],
              inLanguage: MERCHANT_FAQ_JSON_LD.inLanguage,
              mainEntity: MERCHANT_FAQ_JSON_LD.mainEntity,
            },
          ]
        : []),
    ],
  };
}

export default function ForMerchantsPage() {
  const jsonLd = getForMerchantsJsonLd();

  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-primary/20 selection:text-primary">
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* ── Global Navigation ── */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* ── HERO ── */}
        <ForMerchantsHero />

        <section className="border-y border-border/80 bg-canvas py-16 sm:py-24">
          <Container>
            <div className="mb-10 max-w-3xl sm:mb-14">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
                Turn your products and offers into a clear local listing.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground-secondary sm:text-lg">
                Meelte helps nearby residents discover your shop, understand the offer, and
                get directions.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {MERCHANT_CAPABILITIES.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-3xl border border-border/80 bg-surface p-6 shadow-soft sm:p-7"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Merchant onboarding ── */}
        <div id="merchant-enquiry">
          <BusinessAcquisitionSection />
        </div>

        {/* ── Merchant-specific FAQ ── */}
        <FaqSection
          items={MERCHANT_FAQS}
          title="Questions about listing your business?"
          description="Find out what you can publish, where in-person onboarding is available, and how purchases work."
          showMerchantLink={false}
        />
      </main>

      {/* ── Global Footer ── */}
      <Footer />
    </div>
  );
}
