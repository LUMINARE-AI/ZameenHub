import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSearch from "../components/HeroSearch";
import PropertyCard from "../components/PropertyCard";
import PropertySkeleton from "../components/PropertySkeleton";
import Button from "../components/ui/Button";
import useProperties from "../hooks/useProperties";
import { BUY_CATEGORIES } from "../utils/property";

const landStats = [
  { label: "Plot-first listings", value: "Land" },
  { label: "Verified seller data", value: "Direct" },
  { label: "Marketplace type", value: "Buy / Rent" },
];

export default function Home() {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [filters, setFilters] = useState({
    location: "",
    maxPrice: 50000000,
    category: "Plots",
  });

  const featuredPlots = useMemo(
    () => properties.filter((property) => property.category === "Plots").slice(0, 4),
    [properties]
  );

  const recentLands = useMemo(
    () =>
      properties
        .filter((property) =>
          ["Plots", "Commercial Land", "Agricultural Land"].includes(property.category)
        )
        .slice(0, 6),
    [properties]
  );

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleSearch() {
    const params = new URLSearchParams();

    if (filters.location) params.set("location", filters.location);
    if (filters.category) params.set("category", filters.category);
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));

    navigate(`/listings?${params.toString()}`);
  }

  return (
    <div className="space-y-10 pb-8">
      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_26px_90px_-50px_rgba(15,23,42,0.55)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-7">
            <div className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              Real Estate Marketplace
            </div>
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Buy plots, land, shops and verified spaces with confidence.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                ZameenHub is now focused on land and plot discovery first, with
                clean category filters, verified seller contacts, and approval-based listings.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {BUY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    updateFilter("category", category);
                    navigate(`/listings?category=${encodeURIComponent(category)}`);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    category === "Plots"
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <HeroSearch filters={filters} onChange={updateFilter} onSearch={handleSearch} />

            <div className="grid gap-3 sm:grid-cols-3">
              {landStats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-extrabold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,_#dcfce7,_#eff6ff_45%,_#f8fafc)] p-6">
            <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="relative flex h-full flex-col justify-end rounded-[26px] border border-white/80 bg-white/75 p-6 shadow-xl backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-700">
                Plot-focused marketplace
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
                Search by location, category and budget.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Every card below is rendered from approved backend data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
              Featured Plots
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
              Plot listings ready for serious buyers
            </h2>
          </div>
          <Link to="/listings?category=Plots" className="text-sm font-bold text-blue-700">
            View all plots
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <PropertySkeleton key={index} />)
            : featuredPlots.map((property, index) => (
                <PropertyCard key={property._id} property={property} priority={index === 0} />
              ))}
        </div>

        {!loading && featuredPlots.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-8 text-center">
            <p className="text-lg font-bold text-slate-950">No featured plots found</p>
            <p className="mt-2 text-sm text-slate-500">Approved plot listings will appear here.</p>
          </div>
        ) : null}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-700">
              Recently Added Lands
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
              New land opportunities from approved sellers
            </h2>
          </div>
          <Link to="/listings" className="text-sm font-bold text-blue-700">
            Browse marketplace
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <PropertySkeleton key={index} />)
            : recentLands.map((property, index) => (
                <PropertyCard key={property._id} property={property} priority={index === 0} />
              ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-slate-200 bg-slate-950 p-7 text-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-300">
              Sell land faster
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">List your plot with category-first discovery.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Add location, price, category and seller-owned images. Admin approval keeps the marketplace clean.
            </p>
          </div>
          <Link to="/add">
            <Button variant="secondary">List a Plot</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
