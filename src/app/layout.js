import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { metadata as siteMetadata, viewport as siteViewport } from "../lib/seo/metadata.js";
import { getRootJsonLd } from "../lib/seo/structured-data.js";
import { MotionProvider } from "../components/providers/motion-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }) {
  const rootJsonLd = getRootJsonLd();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Favicons / app icons are generated from src/app/icon.png and src/app/apple-icon.png. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootJsonLd),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-foreground">
        <MotionProvider>
          {children}
        </MotionProvider>
        {/*
          Single toast surface for the whole app.
          Visual tokens (surface, border, radius, status colours) are mapped to the Meelte
          design system in app/globals.css — sonner's injected CSS is unlayered, so Tailwind
          utilities cannot reliably override it. See the "Sonner toast tokens" block there.
          Accessibility: sonner renders its own polite live region; containerAriaLabel names it.
        */}
        <Toaster
          position="bottom-right"
          theme="light"
          richColors
          closeButton
          closeButtonAriaLabel="Dismiss notification"
          containerAriaLabel="Notifications"
          visibleToasts={3}
          offset={24}
          mobileOffset={{ bottom: 24, left: 16, right: 16 }}
          toastOptions={{ duration: 5000 }}
        />
      </body>
    </html>
  );
}
