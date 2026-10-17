import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { BackToTop } from "@/components/marketing/BackToTop";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import { AmbientAudio } from "@/components/marketing/AmbientAudio";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const DEFAULT_TITLE = "Sabela Logic — Systems that ship";
const DEFAULT_DESCRIPTION =
  "I build software that carries real weight — payments that clear, one-time PINs that arrive, databases at the edge, deploy pipelines that run without me.";

// Site-wide defaults. metadataBase makes every relative canonical / OG URL
// absolute on the apex domain; pages override title, description, canonical
// and OG/Twitter via pageMetadata() in src/lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  // Google Search Console ownership check (renders <meta name="google-site-verification">).
  verification: {
    google: "n5q2_Ov2M8PoWpWev6y9jSFi98W468AChZZdX5MHK-o",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/brand/monogram.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plexMono.variable} ${plexSans.variable} h-full`}
    >
      <body className="min-h-full text-bone">
        <div className="master-backdrop" aria-hidden="true" />
        <a
          href="#main-content"
          className="fixed left-3 top-3 z-[100] -translate-y-16 rounded-[2px] border border-signal bg-ink px-4 py-2.5 text-[12px] font-bold tracking-[0.06em] text-signal transition-transform duration-150 ease-out focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
        <BackToTop />
        <CookieBanner />
        <AmbientAudio />
      </body>
    </html>
  );
}
