import { ImageResponse } from "next/og";
import { APP_TAGLINE, APP_URL, SITE_NAME } from "../config/site";
import { BRAND_COLORS } from "../constants/app-constants";

export const alt = `${SITE_NAME} — Hyper-Local Community, Events & Business Discovery`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: BRAND_COLORS.canvas,
          backgroundImage:
            "radial-gradient(circle at 24px 24px, rgba(109, 59, 179, 0.08) 2px, transparent 0%), radial-gradient(circle at 84px 84px, rgba(109, 59, 179, 0.06) 2px, transparent 0%)",
          backgroundSize: "120px 120px",
          color: BRAND_COLORS.textPrimary,
          padding: "70px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.primaryLight})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "28px",
              fontWeight: 800,
              boxShadow: "0 30px 60px -30px rgba(109, 59, 179, 0.9)",
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: "30px",
              fontWeight: 700,
              letterSpacing: "-0.6px",
            }}
          >
            {SITE_NAME}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "920px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "6px",
              color: BRAND_COLORS.primary,
            }}
          >
            Discover • Connect • Create • Grow
          </div>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-2px",
              margin: 0,
              color: BRAND_COLORS.textPrimary,
            }}
          >
            {APP_TAGLINE}
          </h1>
          <p
            style={{
              fontSize: "26px",
              lineHeight: 1.5,
              color: BRAND_COLORS.textSecondary,
              margin: 0,
              maxWidth: "820px",
            }}
          >
            Hyper-local community platform for finding nearby shop offers, local events, and the people around you.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(109, 59, 179, 0.18)",
            paddingTop: "26px",
          }}
        >
          <span style={{ fontSize: "18px", color: BRAND_COLORS.textSecondary }}>
            {APP_URL.replace("https://", "")}
          </span>
          <div
            style={{
              display: "flex",
              gap: "18px",
              fontSize: "16px",
              color: BRAND_COLORS.primary,
            }}
          >
            <span>Bengaluru • Gaya • Ranchi • Pan-India</span>
            <span>•</span>
            <span>Privacy First</span>
            <span>•</span>
            <span>Zero Commission</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
