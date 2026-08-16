"use client";

import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import useHomeContent from "@/hooks/useHomeContent";
import { DEFAULT_FOOTER_SETTINGS } from "@/lib/homeContentDefaults";

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

const iconButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand ring-1 ring-brand/15 transition hover:bg-brand hover:text-white";

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.5 2.25h7.214l4.261 5.697L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function phoneHref(phone) {
  const digits = String(phone || "").replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

function whatsappHref(whatsapp) {
  const digits = String(whatsapp || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export default function Footer() {
  const { footerSettings } = useHomeContent();
  const settings = footerSettings || DEFAULT_FOOTER_SETTINGS;

  const socialLinks = [
    settings.instagram
      ? {
          key: "instagram",
          href: settings.instagram,
          label: "Instagram",
          icon: InstagramIcon,
          external: true,
        }
      : null,
    settings.facebook
      ? {
          key: "facebook",
          href: settings.facebook,
          label: "Facebook",
          icon: FacebookIcon,
          external: true,
        }
      : null,
    settings.twitter
      ? {
          key: "twitter",
          href: settings.twitter,
          label: "Twitter",
          icon: TwitterIcon,
          external: true,
        }
      : null,
    settings.email
      ? {
          key: "email",
          href: `mailto:${settings.email}`,
          label: "Email us",
          icon: Mail,
          external: false,
        }
      : null,
    whatsappHref(settings.whatsapp)
      ? {
          key: "whatsapp",
          href: whatsappHref(settings.whatsapp),
          label: "WhatsApp",
          icon: MessageCircle,
          external: true,
        }
      : null,
  ].filter(Boolean);

  const contactLines = [
    settings.phone
      ? {
          key: "phone",
          href: phoneHref(settings.phone),
          label: settings.phone,
          icon: Phone,
        }
      : null,
    settings.email
      ? {
          key: "email",
          href: `mailto:${settings.email}`,
          label: settings.email,
          icon: Mail,
        }
      : null,
    settings.address
      ? {
          key: "address",
          href: "",
          label: settings.address,
          icon: MapPin,
        }
      : null,
  ].filter(Boolean);

  return (
    <footer className="soft-panel mt-4 border-t border-brand/12 text-brand-ink">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="lg:max-w-sm">
            <div className="min-w-0">
              <BrandLogo className="h-14 w-auto sm:h-16" alt="Asli Patta" />
              <p className="mt-2 text-sm text-brand-muted">Real Estate Marketplace</p>
            </div>

            <p className="mt-4 max-w-prose text-sm leading-6 text-brand-muted">
              Plot-focused discovery for land, shops, flats and verified seller-led listings across India.
            </p>

            {contactLines.length > 0 ? (
              <div className="mt-5 space-y-2.5">
                {contactLines.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <>
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                      <span className="text-sm leading-5 text-brand-muted">{item.label}</span>
                    </>
                  );

                  if (item.href) {
                    return (
                      <a
                        key={item.key}
                        href={item.href}
                        className="flex items-start gap-2.5 transition hover:text-brand-dark"
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <div key={item.key} className="flex items-start gap-2.5">
                      {content}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {socialLinks.length > 0 ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      className={iconButtonClass}
                      aria-label={item.label}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.5} />
                    </a>
                  );
                })}
              </div>
            ) : null}

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
