import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const CONTENT = {
  about: {
    label: "About",
    title: "Plot-first real estate discovery",
    body: "ZameenHub is a real estate marketplace focused on land, plots, shops and verified spaces. Listings are submitted by sellers and approved before they appear publicly.",
  },
  contact: {
    label: "Contact",
    title: "Contact ZameenHub",
    body: "For support, seller onboarding or marketplace questions, email support@zameenhub.com or use the seller contact details available on each property detail page.",
  },
  terms: {
    label: "Terms",
    title: "Marketplace terms",
    body: "Users are responsible for verifying property ownership, approvals and legal documentation before transactions. ZameenHub provides discovery and seller contact tools.",
  },
  privacy: {
    label: "Privacy",
    title: "Privacy policy",
    body: "We store account and listing information needed to operate the marketplace, including seller name and phone for approved property contact flows.",
  },
};

export default function InfoPage({ type }) {
  const content = CONTENT[type] || CONTENT.about;

  return (
    <section className="mx-auto max-w-3xl rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
      <p className="text-sm font-bold uppercase tracking-[0.26em] text-blue-600">
        {content.label}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold text-slate-950">{content.title}</h1>
      <p className="mt-5 text-base leading-8 text-slate-600">{content.body}</p>
      <Link to="/listings?category=Plots" className="mt-8 inline-flex">
        <Button>Explore Plots</Button>
      </Link>
    </section>
  );
}
