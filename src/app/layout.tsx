import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, Quicksand } from "next/font/google";

import "./globals.css";
import "./app-ui.css";

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

export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: "Cata — Your cellar, explained.",
  description:
    "Point your camera at a label, a dish, or a question. Cata tells you what to open — including a bottle you already own. Coming soon to iPhone.",
  openGraph: {
    title: "Cata — Your cellar, explained.",
    description:
      "Point your camera at a label, a dish, or a question. Cata tells you what to open — including a bottle you already own.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e2019",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
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
