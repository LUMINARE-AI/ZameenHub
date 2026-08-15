import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

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
    <footer className="soft-panel mt-4 border-t border-brand/12 text-brand-ink">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="lg:max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-brand/10 ring-1 ring-brand/15">
                <BrandLogo className="h-full w-full" alt="" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-brand-ink">Asli Patta</p>
                <p className="text-sm text-brand-muted">Real Estate Marketplace</p>
              </div>
            </div>

            <p className="mt-4 max-w-prose text-sm leading-6 text-brand-muted">
              Plot-focused discovery for land, shops, flats and verified seller-led listings across India.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="mailto:support@aslipatta.com"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand ring-1 ring-brand/15 transition hover:bg-brand hover:text-white"
                aria-label="Email us"
              >
                <Mail className="h-4 w-4" strokeWidth={2.5} />
              </a>
              <a
                href="https://wa.me/919214982277"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand ring-1 ring-brand/15 transition hover:bg-brand hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </div>

            <form
              className="mt-6 rounded-2xl border border-brand/12 bg-white/70 p-4 shadow-sm"
              action="#"
              method="post"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Plot alerts</p>
              <p className="mt-1 text-xs leading-5 text-brand-muted">
                New listings in your city, straight to your inbox.
              </p>
              <div className="mt-3 flex flex-col gap-2 min-[420px]:flex-row">
                <input
                  type="email"
                  placeholder="Your email"
                  aria-label="Email address"
                  className="min-h-11 w-full min-w-0 flex-1 rounded-xl border border-brand/15 bg-white px-3 text-sm text-brand-ink placeholder:text-brand-muted/60 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                />
                <button
                  type="submit"
                  className="min-h-11 shrink-0 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:shadow-lg hover:shadow-brand/30"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 border-t border-brand/10 pt-8 sm:grid-cols-3 lg:contents lg:border-0 lg:pt-0">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-col text-sm text-brand-muted">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.to}
                      className="-mx-2 rounded-lg px-2 py-2 transition hover:bg-brand-light/70 hover:text-brand-dark"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-brand/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-1.5 px-4 py-5 text-center text-xs leading-5 text-brand-muted sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>© {new Date().getFullYear()} Asli Patta. All rights reserved.</p>
          <p>Verified listings · Direct seller contact · No brokerage</p>
        </div>
      </div>
    </footer>
  );
}
