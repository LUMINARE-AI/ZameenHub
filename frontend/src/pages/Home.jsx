import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSearch from "../components/HeroSearch";
import PropertyCard from "../components/PropertyCard";
import PropertySkeleton from "../components/PropertySkeleton";
import Button from "../components/ui/Button";
import useProperties from "../hooks/useProperties";
import { filterProperties } from "../utils/property";

const metrics = [
  { label: "Verified homes", value: "12k+" },
  { label: "Premium localities", value: "320+" },
  { label: "Average response time", value: "12 min" },
];

const quickActions = ["Buy", "Rent", "Sell"];

export default function Home() {
  const navigate = useNavigate();
  const { properties, featuredProperties, loading } = useProperties();
  const [filters, setFilters] = useState({
    location: "",
    maxPrice: 50000000,
    type: "",
    bedrooms: "",
  });

  const trending = useMemo(
    () => filterProperties(featuredProperties.length ? featuredProperties : properties, filters).slice(0, 5),
    [featuredProperties, filters, properties]
  );

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleSearch() {
    const params = new URLSearchParams();

    if (filters.location) {
      params.set("location", filters.location);
    }
    if (filters.type) {
      params.set("type", filters.type);
    }
    if (filters.maxPrice) {
      params.set("maxPrice", String(filters.maxPrice));
    }

    navigate(`/listings?${params.toString()}`);
  }

  return (
    <div className="space-y-10 pb-8">
      <section className="grid gap-8 overflow-hidden rounded-[40px] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_100px_-35px_rgba(15,23,42,0.9)] lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
        <div className="relative z-10 space-y-8">
          <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
            Curated premium real estate
          </div>

          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Find a home that feels unmistakably elevated.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Discover polished listings, smart search flows, and neighborhood-first
              browsing crafted for modern buyers, renters, and sellers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {quickActions.map((label, index) => (
              <Button
                key={label}
                variant={index === 0 ? "primary" : "secondary"}
                className={index === 0 ? "" : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"}
              >
                {label}
              </Button>
            ))}
          </div>

          <HeroSearch filters={filters} onChange={updateFilter} onSearch={handleSearch} />

          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
              >
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-300">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[32px]">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"
            alt="Luxury property exterior"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Featured estate</p>
            <p className="mt-3 text-2xl font-semibold">Oceanfront modern villa</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-200">
              Elegant interiors, private pool deck, and resort-style amenities in a
              headline-worthy address.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">
              Trending now
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              High-interest homes buyers are saving this week
            </h2>
          </div>
          <Link to="/listings" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">
            Browse all listings →
          </Link>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="min-w-[320px] flex-1">
                  <PropertySkeleton />
                </div>
              ))
            : trending.map((property, index) => (
                <div key={property._id} className="min-w-[320px] max-w-[380px] flex-1">
                  <PropertyCard property={property} priority={index === 0} />
                </div>
              ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-white/70 bg-white/80 p-7 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">
            Why ZameenHub
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            Designed to feel like a premium real estate concierge
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Responsive card layouts with clean spacing",
              "Luxury-first visual language and editorial imagery",
              "Fast search, save, and compare workflows",
              "Production-ready sections for listings and detail pages",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.95))] p-7 text-white shadow-[0_24px_70px_-32px_rgba(15,23,42,0.5)]">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-300">
                Seller tools
              </p>
              <h2 className="mt-3 text-3xl font-semibold">List smarter and get discovered faster</h2>
            </div>
            <Link to="/add">
              <Button variant="secondary">Start selling</Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: "94%", label: "buyers prefer image-rich listings" },
              { value: "3x", label: "higher visibility with premium tags" },
              { value: "24/7", label: "always-on inquiry capture" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-5">
                <p className="text-3xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
