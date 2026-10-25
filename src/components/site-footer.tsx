import Image from "next/image";
import Link from "next/link";

const SECTIONS = [
  { href: "/#scan", label: "Scan" },
  { href: "/#pair", label: "Pair" },
  { href: "/#ask", label: "Ask" },
  { href: "/#cellar", label: "Cellar" },
  { href: "/#join", label: "Waitlist" },
] as const;

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-parchment/[0.08] bg-ink">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-10 px-6 py-14 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/" className="block w-fit" aria-label="Cata home">
            <Image src="/brand/cata-logo.png" alt="" width={116} height={48} className="object-contain" />
          </Link>
          <p className="mt-3 text-[15px] text-parchment/50">Your cellar, explained.</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] text-parchment/60" aria-label="Footer">
          {SECTIONS.map((link) => (
            <Link key={link.href} className="transition-colors hover:text-parchment" href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 text-[13px] text-parchment/40">
          <nav className="flex gap-x-5" aria-label="Legal">
            {LEGAL.map((link) => (
              <Link key={link.href} className="transition-colors hover:text-parchment" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p>© 2026 Cata. Please enjoy responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
