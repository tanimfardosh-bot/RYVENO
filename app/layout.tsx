import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://ryveno.com"),
  title: {
    default: "RYVENO — Wear Your Identity | Premium Fashion Bangladesh",
    template: "%s | RYVENO",
  },
  description:
    "RYVENO is a premium affordable fashion brand from Bangladesh. Discover modern everyday fashion for men and women — thoughtfully designed for confidence, comfort and individuality.",
  keywords: [
    "RYVENO", "Bangladesh fashion", "online shopping Bangladesh", "premium fashion",
    "men's clothing", "women's clothing", "BDT", "Wear Your Identity",
  ],
  authors: [{ name: "RYVENO" }],
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://ryveno.com",
    siteName: "RYVENO",
    title: "RYVENO — Wear Your Identity",
    description: "Premium affordable fashion for a generation that believes style is personal.",
    images: [{ url: "/images/hero-men.jpg", width: 1000, height: 1250, alt: "RYVENO campaign" }],
  },
  twitter: { card: "summary_large_image", title: "RYVENO", description: "Wear Your Identity." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RYVENO",
  slogan: "Wear Your Identity.",
  url: "https://ryveno.com",
  description: "Premium affordable fashion brand based in Dhaka, Bangladesh.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+8801700000000",
    contactType: "customer service",
    areaServed: "BD",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <StoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
