import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertySkeleton from "../components/PropertySkeleton";
import FAQAccordion from "../components/FAQAccordion";
import RatingStars from "../components/RatingStars";
import useProperties from "../hooks/useProperties";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    title: "Discover premium plots, land and verified spaces",
    description: "Fast search, professional listings and trusted seller contact for your next investment.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    title: "High-value properties for buyers and investors",
    description: "Explore featured properties with clear pricing, ratings and seller details.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    title: "List your property with a professional seller form",
    description: "Sell your plot, shop or flat with high quality detail fields and fast approvals.",
  },
];

const faqItems = [
  {
    question: "How to buy property?",
    answer:
      "Search by location, category or budget. Review the listing details and contact the seller directly from the property page.",
  },
  {
    question: "How to contact seller?",
    answer:
      "Every listing includes verified seller contact info and a dedicated inquiry CTA to connect instantly.",
  },
  {
    question: "Is this platform verified?",
    answer:
      "ZameenHub reviews each listing before approval, and our verified listings include seller details and property ratings.",
  },
];

const categories = [
  { title: "Plots", color: "bg-sky-50 text-sky-700", query: "Plots" },
  { title: "Commercial Land", color: "bg-amber-50 text-amber-700", query: "Commercial Land" },
  { title: "Agricultural Land", color: "bg-emerald-50 text-emerald-700", query: "Agricultural Land" },
  { title: "Shops", color: "bg-violet-50 text-violet-700", query: "Shops" },
];

export default function Home() {
  const navigate = useNavigate();
  const { properties, featuredProperties, loading, error } = useProperties();
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("Plots");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const sortedProperties = useMemo(
    () => [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [properties]
  );

  const recommendedProperties = useMemo(
    () =>
      properties
        .filter((property) => property.averageRating >= 4)
        .slice(0, 6),
    [properties]
  );

  const popularLocations = useMemo(() => {
    const counts = properties.reduce((acc, property) => {
      const city = property.city || property.location.split(",")[0];
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));
  }, [properties]);

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    if (searchCategory) params.set("category", searchCategory);
    navigate(`/listings?${params.toString()}`);
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[36px] border border-white/70 bg-white/90 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)]">
        <div className="relative">
          <img
            src={heroSlides[activeSlide].image}
            alt={heroSlides[activeSlide].title}
            className="h-[520px] w-full object-cover transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex w-full items-center px-6 sm:px-10 lg:px-16">
            <div className="max-w-2xl rounded-[32px] bg-white/90 px-8 py-10 shadow-2xl backdrop-blur-xl sm:px-10">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Find your best deal</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">
                {heroSlides[activeSlide].title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                {heroSlides[activeSlide].description}
              </p>

              <form onSubmit={handleSearch} className="mt-8 grid gap-4 sm:grid-cols-[1.5fr_1fr]">
                <input
                  value={searchLocation}
                  onChange={(event) => setSearchLocation(event.target.value)}
                  placeholder="Search city or locality"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <select
                  value={searchCategory}
                  onChange={(event) => setSearchCategory(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {heroSlides.map((_, index) => null)}
                  <option value="Plots">Plots</option>
                  <option value="Commercial Land">Commercial Land</option>
                  <option value="Agricultural Land">Agricultural Land</option>
                  <option value="Flats">Flats</option>
                  <option value="Shops">Shops</option>
                </select>
                <button
                  type="submit"
                  className="rounded-3xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Search Listings
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Featured Collections</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Featured Properties</h2>
          </div>
          <div className="text-sm text-slate-500">
            Hand-picked listings with high ratings and strong seller interest.
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(featuredProperties.length > 0 ? featuredProperties : sortedProperties.slice(0, 3)).map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Recommended</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Properties our buyers love</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Popular listings with high ratings, strong value and quick seller response.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-52 animate-pulse rounded-[28px] bg-slate-200" />
                  ))
                : (recommendedProperties.length > 0 ? recommendedProperties : sortedProperties.slice(0, 4)).map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Why ZameenHub</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">Trusted real estate discovery</h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="flex gap-3"><span className="mt-1 text-blue-600">✔</span>Verified listings with seller info.</li>
              <li className="flex gap-3"><span className="mt-1 text-blue-600">✔</span>Data-rich property insights and ratings.</li>
              <li className="flex gap-3"><span className="mt-1 text-blue-600">✔</span>Dedicated support for buyers and sellers.</li>
            </ul>
          </div>

          <div className="rounded-[36px] border border-white/70 bg-blue-950 p-8 text-white shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-300">Start selling</p>
            <h3 className="mt-3 text-2xl font-semibold">List your property today</h3>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              Add detailed seller data, get high visibility and reach verified buyers fast.
            </p>
            <button
              type="button"
              onClick={() => navigate("/add")}
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Post a property
            </button>
          </div>
        </aside>
      </section>

      <section className="space-y-6">
        <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Popular Locations</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {popularLocations.length > 0
              ? popularLocations.map((location) => (
                  <div key={location.city} className="rounded-[28px] bg-slate-50 p-5">
                    <p className="text-lg font-semibold text-slate-950">{location.city}</p>
                    <p className="mt-2 text-sm text-slate-500">{location.count} active listings</p>
                  </div>
                ))
              : Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-[28px] bg-slate-200" />
                ))}
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)]">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Simple, transparent property discovery</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                { title: "Search in minutes", description: "Filter by location, category, budget and ratings." },
                { title: "Review verified listings", description: "See seller details, ratings and clear descriptions." },
                { title: "Contact seller directly", description: "Reach buyers with built-in contact actions." },
                { title: "Make a confident purchase", description: "Choose from top locations and trusted deals." },
              ].map((item) => (
                <div key={item.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] bg-slate-950 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.26em] text-sky-300">Testimonials</p>
              <p className="mt-4 text-xl font-semibold">Trusted by thousands of buyers and sellers.</p>
              <div className="mt-6 space-y-5 text-sm leading-7 text-slate-300">
                <p>“ZameenHub helped me find the perfect plot with clear seller contact and verified details.”</p>
                <p>“Our shop listing generated multiple inquiries within hours thanks to the detailed seller form.”</p>
              </div>
            </div>
            <div className="rounded-[28px] bg-blue-50 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Explore</p>
              <div className="mt-5 grid gap-3">
                {categories.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => navigate(`/listings?category=${encodeURIComponent(item.query)}`)}
                    className={`rounded-3xl px-5 py-4 text-left text-sm font-semibold transition ${item.color} hover:opacity-90`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">FAQ</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-950">Frequently asked questions</h3>
            <div className="mt-6">
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Data-driven trust</p>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
                <div className="rounded-2xl bg-blue-600 px-3 py-2 text-white">1</div>
                <div>
                  <p className="font-semibold text-slate-950">Verified sellers</p>
                  <p>Every approved listing is reviewed before going live.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
                <div className="rounded-2xl bg-blue-600 px-3 py-2 text-white">2</div>
                <div>
                  <p className="font-semibold text-slate-950">Market insights</p>
                  <p>View actual property ratings and nearby location benefits.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
                <div className="rounded-2xl bg-blue-600 px-3 py-2 text-white">3</div>
                <div>
                  <p className="font-semibold text-slate-950">Quick contact</p>
                  <p>Call sellers directly or book viewings from a single page.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
