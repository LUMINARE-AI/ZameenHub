const footerGroups = [
  {
    title: "Explore",
    links: ["Buy Homes", "Rent Homes", "Sell Property", "Luxury Collection"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Press"],
  },
  {
    title: "Support",
    links: ["Contact", "Terms", "Privacy", "Help Center"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/60 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="max-w-sm">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-lg font-bold text-white shadow-lg shadow-blue-500/30">
              ZH
            </div>
            <div>
              <p className="text-lg font-semibold text-white">ZameenHub</p>
              <p className="text-sm text-slate-400">Premium real estate discovery</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Discover high-intent buyers, elegant listings, and a thoughtfully crafted
            property journey built for modern real estate teams.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              {group.title}
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {group.links.map((link) => (
                <p key={link} className="transition hover:text-white">
                  {link}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
