import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertySkeleton from "../components/PropertySkeleton";
import FAQAccordion from "../components/FAQAccordion";
import useProperties from "../hooks/useProperties";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    title: "Find plots, land and shops faster",
    description: "Verified listings with clear pricing, location and seller contact.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    title: "Compare compact property options",
    description: "Browse high-value properties without noisy cards or wasted space.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
    title: "Post property with buyer-ready details",
    description: "List plots, shops and flats with quick approval workflows.",
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
      "ZameenHub reviews each listing before approval, and verified listings include seller details and property ratings.",
  },
];

const categories = [
  { title: "Plots", color: "bg-blue-50 text-blue-700 ring-blue-100", query: "Plots" },
  { title: "Commercial", color: "bg-amber-50 text-amber-700 ring-amber-100", query: "Commercial Land" },
  { title: "Agricultural", color: "bg-emerald-50 text-emerald-700 ring-emerald-100", query: "Agricultural Land" },
  { title: "Shops", color: "bg-violet-50 text-violet-700 ring-violet-100", query: "Shops" },
  { title: "Flats", color: "bg-rose-50 text-rose-700 ring-rose-100", query: "Flats" },
];

export default function Home() {
  const navigate = useNavigate();
  const { properties, featuredProperties, loading } = useProperties();
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("Plots");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const sortedProperties = useMemo(
    () => [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [properties]
  );

  const featuredList = featuredProperties.length > 0 ? featuredProperties : sortedProperties;
  const recommendedProperties = useMemo(
    () =>
      properties
        .filter((property) => property.averageRating >= 4)
        .slice(0, 10),
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
      .slice(0, 8)
      .map(([city, count]) => ({ city, count }));
  }, [properties]);

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    if (searchCategory) params.set("category", searchCategory);
    navigate(`/listings?${params.toString()}`);
  }

  function handleTouchEnd(event) {
    const distance = touchStart - event.changedTouches[0].clientX;
    if (Math.abs(distance) < 40) return;
    setActiveSlide((current) =>
      distance > 0
        ? (current + 1) % heroSlides.length
        : (current - 1 + heroSlides.length) % heroSlides.length
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm"
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={heroSlides[activeSlide].image}
          alt={heroSlides[activeSlide].title}
          className="h-[310px] w-full object-cover opacity-70 sm:h-[340px] lg:h-[360px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/10" />
        <div className="absolute inset-0 flex items-center px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">ZameenHub marketplace</p>
            <h1 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-4xl">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">
              {heroSlides[activeSlide].description}
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-4 grid gap-2 rounded-2xl bg-white/95 p-2 shadow-lg sm:grid-cols-[1.5fr_1fr_auto]"
            >
              <input
                value={searchLocation}
                onChange={(event) => setSearchLocation(event.target.value)}
                placeholder="City or locality"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <select
                value={searchCategory}
                onChange={(event) => setSearchCategory(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((item) => (
                  <option key={item.query} value={item.query}>
                    {item.title}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <div className="mt-3 flex gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition ${
                    index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/50"
                  }`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => navigate(`/listings?category=${encodeURIComponent(item.query)}`)}
            className={`rounded-xl px-4 py-3 text-left text-sm font-bold ring-1 transition hover:-translate-y-0.5 hover:shadow-sm ${item.color}`}
          >
            {item.title}
            <span className="mt-1 block text-xs font-medium opacity-75">Browse listings</span>
          </button>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Featured</p>
            <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">Top properties near you</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/listings")}
            className="min-h-10 rounded-full bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => <PropertySkeleton key={index} />)
            : featuredList.slice(0, 10).map((property, index) => (
                <PropertyCard key={property._id} property={property} priority={index < 3} />
              ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Recommended</p>
              <h2 className="text-xl font-extrabold text-slate-950">Buyer favorites</h2>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <PropertySkeleton key={index} />)
              : (recommendedProperties.length > 0 ? recommendedProperties : sortedProperties)
                  .slice(0, 6)
                  .map((property) => <PropertyCard key={property._id} property={property} />)}
          </div>
        </div>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Popular locations</p>
            <div className="mt-3 grid gap-2">
              {popularLocations.length > 0
                ? popularLocations.map((location) => (
                    <button
                      key={location.city}
                      type="button"
                      onClick={() => navigate(`/listings?location=${encodeURIComponent(location.city)}`)}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-left text-sm transition hover:bg-blue-50"
                    >
                      <span className="font-bold text-slate-900">{location.city}</span>
                      <span className="text-xs text-slate-500">{location.count} listings</span>
                    </button>
                  ))
                : Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-10 animate-pulse rounded-xl bg-slate-100" />
                  ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Sell faster</p>
            <h3 className="mt-1 text-lg font-extrabold">Post your property today</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Add clear price, location, image and details for quicker buyer response.
            </p>
            <button
              type="button"
              onClick={() => navigate("/add")}
              className="mt-3 min-h-10 rounded-full bg-white px-4 text-xs font-bold text-slate-950 transition hover:bg-slate-100"
            >
              Post property
            </button>
          </div>
        </aside>
      </section>

      <section className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">How it works</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-950">Simple property discovery</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/listings")}
              className="min-h-10 rounded-full bg-blue-50 px-4 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              Browse listings
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { icon: "01", title: "Search", description: "Filter by location, category and budget." },
              { icon: "02", title: "Compare", description: "Check price, title, area and seller details." },
              { icon: "03", title: "Contact", description: "Call or request details from the listing." },
              { icon: "04", title: "Close", description: "Move ahead with verified property information." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-extrabold text-blue-700 shadow-sm">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid flex-1 gap-3 xl:grid-cols-[1fr_280px]">
            <div className="rounded-xl bg-slate-950 p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Why choose ZameenHub</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  "Verified listings",
                  "Direct seller contact",
                  "No brokerage",
                  "Fast search",
                ].map((item) => (
                  <div key={item} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Post your property</p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-950">Reach buyers faster</h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                Add your property with price, location and photos for better visibility.
              </p>
              <button
                type="button"
                onClick={() => navigate("/add")}
                className="mt-3 min-h-10 rounded-full bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                Post property
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-slate-950">More active listings</p>
              <span className="text-xs font-semibold text-slate-500">Compact view</span>
            </div>
            <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => <PropertySkeleton key={index} />)
                : (recommendedProperties.length > 0 ? recommendedProperties : sortedProperties)
                    .slice(0, 3)
                    .map((property) => <PropertyCard key={property._id} property={property} />)}
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">FAQ</p>
            <div className="mt-3">
              <FAQAccordion items={faqItems} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Popular locations</p>
            <div className="mt-3 grid gap-2">
              {popularLocations.length > 0
                ? popularLocations.slice(0, 4).map((location) => (
                    <button
                      key={location.city}
                      type="button"
                      onClick={() => navigate(`/listings?location=${encodeURIComponent(location.city)}`)}
                      className="flex min-h-10 items-center justify-between rounded-xl bg-slate-50 px-3 text-left text-sm transition hover:bg-blue-50"
                    >
                      <span className="font-bold text-slate-900">{location.city}</span>
                      <span className="text-xs text-slate-500">{location.count}</span>
                    </button>
                  ))
                : Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-10 animate-pulse rounded-xl bg-slate-100" />
                  ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
