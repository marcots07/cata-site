import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

import {
  AskPreview,
  CellarPreview,
  PairPreview,
  ScanCameraScreen,
  ScanResultScreen,
} from "@/components/app-screens";
import { Grid, ScanFrame, Sparkle } from "@/components/icons";
import { Phone } from "@/components/phone";
import { RevealController } from "@/components/reveal-controller";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WaitlistForm } from "@/components/waitlist-form";
import { WineStage } from "@/components/wine-stage";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

const VARIETALS = [
  "Syrah",
  "Valle de Guadalupe",
  "Cabernet Franc",
  "Malbec",
  "Rioja Reserva",
  "Tempranillo",
  "Pinot Noir",
  "Baja California",
];

const SCAN_POINTS = [
  {
    icon: <ScanFrame size={20} />,
    title: "It finds the bottle for you",
    body: "Live detection frames the label before you tap the shutter.",
  },
  {
    icon: <Grid size={20} />,
    title: "One bottle or the whole shelf",
    body: "Many bottles mode boxes every bottle in the frame at once.",
  },
  {
    icon: <Sparkle size={20} />,
    title: "Honest about what it knows",
    body: "Taste profiles and notes are marked whenever Cata estimates them.",
  },
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Varietals />
        <ScanSection />
        <FeatureGrid />
        <Closing />
      </main>
      <SiteFooter />
      <RevealController />
    </>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[max(100svh,640px)] overflow-hidden">
      <WineStage className="absolute inset-0 -z-20" />
      <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto flex min-h-[max(100svh,640px)] w-full max-w-[1360px] flex-col justify-end px-6 pb-14 pt-32 sm:px-10 md:justify-center md:pb-20">
        <div className="max-w-[640px]">
          <p
            className="rise inline-flex items-center gap-2.5 rounded-full border border-parchment/15 bg-parchment/[0.06] py-1.5 pl-3 pr-4 text-[13px] text-parchment/80 backdrop-blur-md"
            style={delay(0.15)}
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-burgundy-bright/70" />
              <span className="relative size-2 rounded-full bg-burgundy-bright" />
            </span>
            Coming soon to iPhone
          </p>
          <h1 className="mt-7 font-display text-[clamp(4rem,10.5vw,9.5rem)] leading-[0.86] tracking-[-0.03em]">
            <span className="rise block" style={delay(0.25)}>
              Your cellar,
            </span>
            <span className="rise block pb-2 pr-3 italic" style={delay(0.38)}>
              <span className="text-sheen">explained.</span>
            </span>
          </h1>
          <p
            className="rise mt-6 max-w-[31rem] text-[17px] leading-relaxed text-parchment/70 sm:text-xl sm:leading-relaxed"
            style={delay(0.52)}
          >
            Point your camera at a label, a dish, or a question. Cata tells you what to open —
            including a bottle you already own.
          </p>
          <div className="rise mt-9" style={delay(0.66)}>
            <WaitlistForm id="waitlist" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto hidden max-w-[1360px] items-end justify-between px-10 lg:flex">
        <a
          href="#scan"
          className="pointer-events-auto flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-parchment/50 transition-colors hover:text-parchment"
        >
          <span className="scroll-cue relative h-10 w-px overflow-hidden bg-parchment/20" />
          Scroll
        </a>
        <p className="text-[11px] uppercase tracking-[0.24em] text-parchment/40">
          Move your cursor to shift the light
        </p>
      </div>
    </section>
  );
}

function Varietals() {
  const words = [...VARIETALS, ...VARIETALS];
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-parchment/[0.08] py-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink to-transparent" />
      <div className="marquee flex w-max items-center whitespace-nowrap font-display text-[clamp(1.9rem,3.4vw,2.9rem)] italic leading-none text-parchment/30">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="flex items-center">
            <span className="px-9">{word}</span>
            <svg viewBox="0 0 10 10" className="size-2.5 text-burgundy-bright/70">
              <path d="M5 0 10 5 5 10 0 5z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

function ScanSection() {
  return (
    <section id="scan" className="grain paper-grain relative overflow-hidden bg-parchment text-ink">
      <div className="mx-auto grid max-w-[1360px] items-center gap-20 px-6 py-28 sm:px-10 md:py-40 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="relative z-10">
          <p className="eyebrow text-burgundy" data-reveal>
            01 — Scan
          </p>
          <h2
            className="mt-6 font-display text-[clamp(3.2rem,6.4vw,6rem)] leading-[0.92] tracking-[-0.025em]"
            data-reveal
            style={delay(0.05)}
          >
            Scan any bottle.
            <br />
            <span className="italic text-sheen-ink">Know it instantly.</span>
          </h2>
          <p className="mt-7 max-w-[30rem] text-lg leading-relaxed text-olive" data-reveal style={delay(0.1)}>
            Point your camera at a label to see what it is, how it tastes and what to pair it with.
          </p>
          <ul className="mt-12 max-w-[34rem] divide-y divide-olive/15 border-y border-olive/15" data-reveal style={delay(0.15)}>
            {SCAN_POINTS.map((point) => (
              <li key={point.title} className="flex gap-5 py-5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                  {point.icon}
                </span>
                <span>
                  <span className="block text-[17px] font-medium text-ink">{point.title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted">{point.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto h-[500px] w-full max-w-[360px] sm:h-[660px] sm:max-w-[580px]" data-reveal style={delay(0.1)}>
          <div aria-hidden="true" className="absolute inset-x-6 bottom-6 top-24 rounded-[50%] bg-burgundy/25 blur-[90px]" />
          <div className="absolute left-0 top-12 sm:top-16">
            <div className="drift [--r:-7deg]" style={delay(0.6)}>
              <Phone className="[--s:0.48] sm:[--s:0.64]">
                <ScanCameraScreen />
              </Phone>
            </div>
          </div>
          <div className="absolute right-0 top-0">
            <div className="drift [--r:4deg]">
              <Phone className="[--s:0.5] sm:[--s:0.66]">
                <ScanResultScreen />
              </Phone>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  id,
  index,
  title,
  body,
  tone = "light",
  className = "",
  backdrop,
  children,
  style,
}: {
  id: string;
  index: string;
  title: string;
  body: string;
  tone?: "light" | "dark";
  className?: string;
  backdrop?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const dark = tone === "dark";
  return (
    <article
      id={id}
      data-reveal
      style={style}
      className={`group relative isolate flex flex-col overflow-hidden rounded-[32px] border ${
        dark ? "border-parchment/10 bg-ink text-parchment" : "border-olive/10 bg-parchment-deep text-ink"
      } ${className}`}
    >
      {backdrop}
      <div className="relative z-10 p-8 sm:p-10">
        <p className={`eyebrow ${dark ? "text-burgundy-bright" : "text-burgundy"}`}>{index}</p>
        <h3 className="mt-4 font-display text-[clamp(2.2rem,3.4vw,3.1rem)] leading-[0.98] tracking-[-0.02em]">{title}</h3>
        <p className={`mt-3 max-w-[26rem] text-[16px] leading-relaxed ${dark ? "text-parchment/65" : "text-olive"}`}>{body}</p>
      </div>
      <div className="relative mt-auto">{children}</div>
    </article>
  );
}

function FeatureGrid() {
  return (
    <section className="grain paper-grain relative bg-parchment pb-28 text-ink md:pb-40">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10">
        <div className="flex flex-col justify-between gap-6 border-t border-olive/15 pt-16 md:flex-row md:items-end md:pt-24">
          <h2 className="font-display text-[clamp(2.8rem,5.6vw,5rem)] leading-[0.94] tracking-[-0.025em]" data-reveal>
            Pair it. Ask it.
            <br />
            <span className="italic text-sheen-ink">Keep it.</span>
          </h2>
          <p className="max-w-[24rem] text-lg leading-relaxed text-olive md:pb-2" data-reveal style={delay(0.08)}>
            Scanning is the start. Cata remembers every bottle you keep, so its answers come from your
            own cellar.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <FeatureCard
            id="pair"
            index="02 — Pair"
            title="The right wine for your meal."
            body="Snap the dish and Cata picks a bottle from your own cellar."
            className="lg:col-span-7"
          >
            <div className="relative px-5 pb-6 sm:h-[440px] sm:p-0">
              <div className="relative h-[220px] overflow-hidden rounded-[22px] sm:absolute sm:inset-y-0 sm:left-10 sm:h-auto sm:w-[58%] sm:rounded-b-none">
                <Image
                  src="/app/steak-frites.jpg"
                  alt="Steak frites on a white plate"
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="relative -mt-14 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0 sm:w-[400px]">
                <PairPreview />
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            id="ask"
            index="03 — Ask"
            title="Ask Cata anything."
            body="What to open tonight, what to buy, what goes with what."
            tone="dark"
            className="lg:col-span-5"
            style={delay(0.08)}
            backdrop={<div aria-hidden="true" className="ask-glow absolute inset-0 -z-10" />}
          >
            <div className="px-5 pb-6 sm:px-10 sm:pb-10">
              <AskPreview />
            </div>
          </FeatureCard>

          <article
            id="cellar"
            data-reveal
            className="relative isolate grid overflow-hidden rounded-[32px] border border-olive/10 bg-parchment-deep text-ink lg:col-span-12 lg:min-h-[480px] lg:grid-cols-[1fr_1.05fr]"
          >
            <div className="relative flex flex-col p-8 sm:p-10 lg:p-14">
              <p className="eyebrow text-burgundy">04 — Cellar</p>
              <h3 className="mt-4 font-display text-[clamp(2.2rem,3.4vw,3.1rem)] leading-[0.98] tracking-[-0.02em]">
                Keep it in your cellar.
              </h3>
              <p className="mt-3 max-w-[26rem] text-[16px] leading-relaxed text-olive lg:mb-10">
                Every bottle you add is saved, searchable and sorted into folders.
              </p>
              <div aria-hidden="true" className="relative mt-auto hidden h-[320px] lg:block">
                <div className="absolute -bottom-36 -left-24 h-[420px] w-[560px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(192,135,47,0.28),rgba(153,51,53,0.14)_55%,transparent)]" />
                <div className="absolute -bottom-24 left-0 flex items-end">
                  <Image
                    src="/app/dbc-cabernet.jpg"
                    alt=""
                    width={273}
                    height={912}
                    className="relative w-[118px] mix-blend-multiply"
                  />
                  <Image
                    src="/app/hermelinda-cutout.png"
                    alt=""
                    width={273}
                    height={912}
                    className="relative z-10 -mx-5 w-[134px] drop-shadow-[0_24px_24px_rgba(30,24,18,0.3)]"
                  />
                  <Image
                    src="/app/dbc-malbec.jpg"
                    alt=""
                    width={273}
                    height={912}
                    className="relative w-[118px] mix-blend-multiply"
                  />
                </div>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden lg:flex lg:h-auto lg:items-center lg:overflow-visible lg:py-14 lg:pl-6 lg:pr-14">
              <div className="absolute inset-x-5 top-0 mx-auto max-w-[420px] sm:inset-x-10 lg:static lg:ml-auto lg:mr-0 lg:w-full lg:max-w-[460px]">
                <CellarPreview />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section id="join" className="grain relative isolate overflow-hidden bg-ink py-32 md:py-48">
      <div aria-hidden="true" className="closing-glow absolute inset-0 -z-10" />
      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-6 text-center">
        <p className="eyebrow text-parchment/50" data-reveal>
          The waitlist is open
        </p>
        <h2
          className="mt-7 font-display text-[clamp(3.4rem,8.6vw,8rem)] leading-[0.9] tracking-[-0.03em]"
          data-reveal
          style={delay(0.06)}
        >
          What should I
          <br />
          <span className="italic text-sheen">open tonight?</span>
        </h2>
        <p className="mt-8 max-w-[33rem] text-lg leading-relaxed text-parchment/65" data-reveal style={delay(0.12)}>
          Cata is coming to iPhone. Leave your email and we&apos;ll tell you the moment you can ask it
          yourself.
        </p>
        <div className="mt-11 flex w-full justify-center" data-reveal style={delay(0.18)}>
          <WaitlistForm id="waitlist-closing" align="center" />
        </div>
      </div>
    </section>
  );
}

