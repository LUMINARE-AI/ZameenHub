import { Link } from "react-router-dom";

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
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="max-w-sm">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
              ZH
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-950">ZameenHub</p>
              <p className="text-sm text-slate-500">Real Estate Marketplace</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Plot-focused discovery for land, shops, flats and verified seller-led listings.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
              {group.title}
            </p>
            <div className="mt-4 space-y-3 text-sm">
              {group.links.map((link) => (
                <Link key={link.label} to={link.to} className="block transition hover:text-blue-700">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
