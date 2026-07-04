import Link from "next/link";
import { LayoutGrid, Mail, MessageCircle } from "lucide-react";

const footerGroups = [
  {
    title: "Buy",
    links: [
      { label: "Plots", to: "/buy-plots" },
      { label: "Commercial Land", to: "/listings?category=Commercial+Land" },
      { label: "Agricultural Land", to: "/listings?category=Agricultural+Land" },
      { label: "Shops", to: "/listings?category=Shops" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Sell Property", to: "/add" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-dark/20 bg-brand-dark text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="max-w-sm">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20">
              <LayoutGrid className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display text-lg font-bold">ZameenHub</p>
              <p className="text-sm text-white/60">Real Estate Marketplace</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Plot-focused discovery for land, shops, flats and verified seller-led listings across India.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="mailto:support@zameenhub.com"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-brand-accent hover:text-brand-dark"
              aria-label="Email us"
            >
              <Mail className="h-4 w-4" strokeWidth={2.5} />
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-brand-accent hover:text-brand-dark"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>

          <form className="mt-6" action="#" method="post">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
              Plot alerts
            </p>
            <div className="mt-2 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="min-h-10 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-brand-accent px-4 text-xs font-bold text-brand-dark transition hover:bg-brand-accent-dark"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-accent/80">
              {group.title}
            </p>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              {group.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.to}
                  className="block transition hover:text-brand-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} ZameenHub. All rights reserved.</p>
          <p>Verified listings · Direct seller contact · No brokerage</p>
        </div>
      </div>
    </footer>
  );
}
