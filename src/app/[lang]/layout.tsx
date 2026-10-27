import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, Quicksand } from "next/font/google";

import { getDictionaryOrDefault } from "@/i18n/get-dictionary";
import { defaultLocale, hasLocale, htmlLang, locales, openGraphLocale } from "@/i18n/locales";

import "../globals.css";
import "../app-ui.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const app = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1e2019",
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getDictionaryOrDefault();
  return {
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    openGraph: {
      locale: openGraphLocale(locale),
      alternateLocale: [locale === "es" ? "en_US" : "es_MX"],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  return (
    <html
      lang={htmlLang(hasLocale(lang) ? lang : defaultLocale)}
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${app.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-svh font-sans">{children}</body>
    </html>
  );
}
