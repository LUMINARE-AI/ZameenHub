import Link from "next/link";
import Button from "@/components/ui/Button";

const CONTENT = {
  about: {
    label: "About",
    title: "Plot-first real estate discovery",
    body: "ZameenHub is a real estate marketplace focused on land, plots, shops and verified spaces. Listings are submitted by sellers and approved before they appear publicly.",
    hero:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    cta: { label: "Explore Plots", href: "/buy-plots" },
  },
  contact: {
    label: "Contact",
    title: "Contact ZameenHub",
    body: "For support, seller onboarding or marketplace questions, email support@zameenhub.com or use the seller contact details available on each property detail page.",
    hero:
      "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80",
    cta: { label: "Browse Listings", href: "/listings" },
  },
  terms: {
    label: "Terms",
    title: "Marketplace terms",
    body: "Users are responsible for verifying property ownership, approvals and legal documentation before transactions. ZameenHub provides discovery and seller contact tools.",
    hero:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    cta: { label: "Read Privacy", href: "/privacy" },
  },
  privacy: {
    label: "Privacy",
    title: "Privacy policy",
    body: "We store account and listing information needed to operate the marketplace, including seller name and phone for approved property contact flows.",
    hero:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    cta: { label: "Contact Us", href: "/contact" },
  },
};

export default function InfoPage({ type }) {
  const content = CONTENT[type] || CONTENT.about;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl">
        <img
          src={content.hero}
          alt=""
          className="h-48 w-full object-cover sm:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-brand-dark/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-brand-accent">{content.label}</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            {content.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,92,72,0.2)]">
        <p className="text-base leading-8 text-brand-muted">{content.body}</p>

        {type === "contact" ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-light/50 p-4 ring-1 ring-brand/10">
              <p className="text-xs font-bold uppercase tracking-wide text-brand">Email</p>
              <a
                href="mailto:support@zameenhub.com"
                className="mt-2 block text-sm font-semibold text-brand-dark hover:text-brand"
              >
                support@zameenhub.com
              </a>
            </div>
            <div className="rounded-2xl bg-brand-light/50 p-4 ring-1 ring-brand/10">
              <p className="text-xs font-bold uppercase tracking-wide text-brand">Response time</p>
              <p className="mt-2 text-sm font-semibold text-brand-ink">Within 24 hours</p>
            </div>
          </div>
        ) : null}

        {type === "about" ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { stat: "Verified", label: "Listing approval" },
              { stat: "Direct", label: "Seller contact" },
              { stat: "₹0", label: "Brokerage fee" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-brand-light/50 p-4 text-center ring-1 ring-brand/10">
                <p className="font-display text-2xl font-bold text-brand-dark">{item.stat}</p>
                <p className="mt-1 text-xs font-semibold text-brand-muted">{item.label}</p>
              </div>
            ))}
          </div>
        ) : null}

        <Link href={content.cta.href} className="mt-8 inline-flex">
          <Button variant="accent">{content.cta.label}</Button>
        </Link>
      </section>
    </div>
  );
}
