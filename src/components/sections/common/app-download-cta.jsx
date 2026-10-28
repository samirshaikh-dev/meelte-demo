import React from "react";
import { Download, Smartphone, QrCode, ShieldCheck, Star } from "@/lib/icons";
import { PLAY_STORE_URL } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function AppDownloadCTA() {
  return (
    <section className="py-16 sm:py-24 bg-canvas">
      <Container>
        <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-[#4A247A] text-white p-8 sm:p-12 lg:p-16 shadow-card relative overflow-hidden">
          {/* Ambient decorative circular elements */}
          <div
            className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-4">
                <Smartphone className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span>Your Neighborhood in Your Pocket</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Download the Meelte App & discover your neighborhood today.
              </h2>

              <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-xl">
                Explore local dining, regional fashion, community events, trusted services, and verified neighborhood jobs on Android and Web.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button
                  as="a"
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="accent"
                  size="lg"
                  className="shadow-soft hover:shadow-card font-bold text-accent-foreground group"
                >
                  <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                  <span>Download on Google Play</span>
                </Button>

                <div className="flex items-center gap-2 text-xs text-white/80 sm:pl-2">
                  <ShieldCheck className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                  <span>Free • Safe • Privacy Protected</span>
                </div>
              </div>
            </div>

            {/* Right side: Mock App Preview Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-xs p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent text-accent-foreground font-bold flex items-center justify-center text-sm">
                      M
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-none">Meelte App</div>
                      <div className="text-[10px] text-white/70 mt-0.5">Hyper-local Discovery</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20">
                    v1.0
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-accent fill-accent" aria-hidden="true" />
                    <span>Real-time local alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-accent fill-accent" aria-hidden="true" />
                    <span>Direct merchant chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-accent fill-accent" aria-hidden="true" />
                    <span>Resume upload job applications</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/15 text-center">
                  <span className="text-[11px] text-white/80">Available on Google Play Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AppDownloadCTA;
