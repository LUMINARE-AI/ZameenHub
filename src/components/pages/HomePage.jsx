"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Handshake,
  MessageCircle,
  Phone,
  Search,
  Scale,
  Star,
  Trees,
  Building2,
  Store,
  Wheat,
  Home,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import PropertySkeleton from "@/components/PropertySkeleton";
import FAQAccordion from "@/components/FAQAccordion";
import useProperties from "@/hooks/useProperties";

const heroSlides = [
  {
    image: "/property1.jpeg",
    title: "Find plots, land and shops faster",
    description: "Verified listings with clear pricing, location and seller contact.",
  },
  {
    image: "/property2.jpeg",
    title: "Compare compact property options",
    description: "Browse high-value properties without noisy cards or wasted space.",
  },
  {
    image: "/property3.jpeg",
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
      "Asli Patta reviews each listing before approval, and verified listings include seller details and property ratings.",
  },
];

const categoryTiles = [
  {
    title: "Plots",
    query: "Plots",
    icon: Trees,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Commercial",
    query: "Commercial Land",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Agricultural",
    query: "Agricultural Land",
    icon: Wheat,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Shops",
    query: "Shops",
    icon: Store,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Flats",
    query: "Flats",
    icon: Home,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  },
];

const categories = categoryTiles.map(({ title, query }) => ({ title, query }));

const howItWorks = [
  { icon: Search, title: "Search", description: "Filter by location, category and budget." },
  { icon: Scale, title: "Compare", description: "Check price, title, area and seller details." },
  { icon: Phone, title: "Contact", description: "Call or request details from the listing." },
  { icon: Handshake, title: "Close", description: "Move ahead with verified property information." },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Plot buyer, Jaipur",
    quote: "Found a verified plot in 2 days. Direct seller contact saved brokerage.",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    role: "Shop seller, Udaipur",
    quote: "Listed my shop and got genuine inquiries within a week. Smooth approval process.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Land investor, Ahmedabad",
    quote: "Clean search filters and verified badges make comparison so much easier.",
    rating: 4,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { properties, featuredProperties, loading } = useProperties();
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [searchCity, setSearchCity] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("Plots");
  const [maxBudget, setMaxBudget] = useState(50000000);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const sortedProperties = useMemo(
    () => [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [properties]
  );

  const featuredList = featuredProperties.length > 0 ? featuredProperties : sortedProperties;

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

  const trustStats = useMemo(
    () => [
      { label: "Active listings", value: `${properties.length || 0}+` },
      { label: "Verified sellers", value: `${Math.max(properties.filter((p) => p.status === "approved").length, 0)}+` },
      { label: "Cities covered", value: `${Math.max(popularLocations.length, 1)}+` },
      { label: "Brokerage fee", value: "₹0" },
    ],
    [properties, popularLocations]
  );

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    const location = [searchCity.trim(), searchKeyword.trim()].filter(Boolean).join(" ");
    if (location) params.set("location", location);
    if (searchCategory) params.set("category", searchCategory);
    if (maxBudget < 50000000) params.set("maxPrice", String(maxBudget));
    router.push(`/listings?${params.toString()}`);
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
    <div className="-mt-[var(--navbar-offset)] space-y-8 sm:space-y-10 lg:space-y-12">
      <section
        className="full-bleed relative overflow-hidden bg-brand-ink"
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[680px]">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              fetchPriority={index === 0 ? "high" : "low"}
              aria-hidden={index !== activeSlide}
            />
          ))}

          <div className="hero-overlay pointer-events-none absolute inset-0" />

          <div className="relative z-10 mx-auto flex min-h-[580px] max-w-[1440px] flex-col justify-end px-4 pb-10 pt-[5.5rem] sm:min-h-[620px] sm:justify-center sm:px-6 sm:pb-12 lg:min-h-[680px] lg:px-10 lg:pb-16">
            <div className="w-full max-w-3xl px-1 py-4 sm:px-2 sm:py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent-light sm:text-xs">
                Asli Property. Verified Details.
              </p>
              <h1 className="font-display mt-3 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your Search for the Asli Property Starts Here.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                Find verified plots with clear ownership, documentation, location and seller
                details—helping you make informed property decisions.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="hero-search-glass relative z-10 mt-8 w-full max-w-5xl rounded-2xl border border-white/50 p-4 sm:mt-10 sm:p-5"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto] md:items-end md:gap-3">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold tracking-wide text-brand-ink/80">City</span>
                  <input
                    value={searchCity}
                    onChange={(event) => setSearchCity(event.target.value)}
                    placeholder="Jaipur"
                    className="min-h-11 w-full rounded-xl border border-brand-dark/10 bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-semibold tracking-wide text-brand-ink/80">Property Type</span>
                  <select
                    value={searchCategory}
                    onChange={(event) => setSearchCategory(event.target.value)}
                    className="min-h-11 w-full rounded-xl border border-brand-dark/10 bg-white px-4 text-sm text-brand-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  >
                    {categories.map((item) => (
                      <option key={item.query} value={item.query}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-semibold tracking-wide text-brand-ink/80">Search</span>
                  <input
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="Search projects or localities..."
                    className="min-h-11 w-full rounded-xl border border-brand-dark/10 bg-white px-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/60 focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-accent px-5 text-sm font-bold text-white shadow-md shadow-brand-accent/25 transition duration-200 hover:scale-[1.02] hover:bg-brand-accent-dark hover:shadow-lg md:w-12 md:px-0"
                  aria-label="Search properties"
                >
                  <Search className="h-5 w-5" strokeWidth={2.5} />
                  <span className="md:hidden">Search</span>
                </button>
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-semibold text-brand-ink/80">
                  Max budget: ₹{(maxBudget / 10000000).toFixed(1)} Cr
                </span>
                <input
                  type="range"
                  min="5000000"
                  max="50000000"
                  step="500000"
                  value={maxBudget}
                  onChange={(event) => setMaxBudget(Number(event.target.value))}
                  className="mt-2 w-full accent-brand"
                />
              </label>
            </form>

            <div className="mt-6 flex items-center gap-2.5">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? "h-2 w-10 bg-brand-accent-light shadow-sm shadow-black/20"
                      : "h-2 w-2 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section soft-panel rounded-2xl border border-brand/12 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal-section space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Browse by type</p>
          <h2 className="font-display text-xl font-extrabold text-brand-ink sm:text-2xl">
            Explore property categories
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categoryTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.query}
                type="button"
                onClick={() => router.push(`/listings?category=${encodeURIComponent(tile.query)}`)}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10"
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-brand">
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-bold">{tile.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="reveal-section space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Featured</p>
            <h2 className="font-display text-xl font-extrabold text-brand-ink sm:text-2xl">
              Featured and latest properties
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/listings")}
            className="min-h-9 rounded-full bg-brand px-4 text-xs font-bold text-white transition hover:bg-brand-dark"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => <PropertySkeleton key={index} />)
            : featuredList.slice(0, 10).map((property, index) => (
                <PropertyCard key={property._id} property={property} priority={index < 3} />
              ))}
        </div>
      </section>

      <section className="reveal-section rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Popular locations</p>
            <h2 className="font-display text-lg font-extrabold text-brand-ink">Browse by city</h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/listings")}
            className="min-h-9 rounded-full bg-brand-light px-4 text-xs font-bold text-brand-dark transition hover:bg-brand/15"
          >
            Explore listings
          </button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {popularLocations.length > 0
            ? popularLocations.slice(0, 8).map((location) => (
                <button
                  key={location.city}
                  type="button"
                  onClick={() =>
                    router.push(`/listings?location=${encodeURIComponent(location.city)}`)
                  }
                  className="flex min-h-11 items-center justify-between rounded-xl bg-brand-light/50 px-3 text-left text-sm ring-1 ring-brand/10 transition hover:bg-brand-light hover:ring-brand/25"
                >
                  <span className="truncate font-bold text-brand-ink">{location.city}</span>
                  <span className="shrink-0 text-xs text-brand-muted">{location.count} listings</span>
                </button>
              ))
            : Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-11 animate-shimmer rounded-xl" />
              ))}
        </div>
      </section>

      <section className="reveal-section rounded-2xl border border-brand/10 bg-brand-light/50 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Testimonials</p>
        <h2 className="font-display mt-1 text-lg font-extrabold text-brand-ink sm:text-xl">
          What buyers &amp; sellers say
        </h2>
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-brand/10 bg-white p-5 shadow-sm">
          {testimonials.map((item, index) => (
            <div
              key={item.name}
              className={`transition-all duration-500 ${
                index === activeTestimonial
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-0 p-5 opacity-0"
              }`}
            >
              <div className="flex gap-1 text-brand-accent">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-7 text-brand-muted sm:text-base">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-bold text-brand-ink">{item.name}</p>
              <p className="text-xs text-brand-muted">{item.role}</p>
            </div>
          ))}
          <div className="mt-4 flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveTestimonial(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeTestimonial ? "w-6 bg-brand" : "w-1.5 bg-brand/20"
                }`}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-section grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">How it works</p>
              <h2 className="font-display mt-1 text-lg font-extrabold text-brand-ink sm:text-xl">
                Simple property discovery
              </h2>
            </div>
            <button
              type="button"
              onClick={() => router.push("/listings")}
              className="min-h-9 rounded-full bg-brand-light px-4 text-xs font-bold text-brand-dark transition hover:bg-brand/15"
            >
              Browse listings
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-xl bg-brand-light/40 p-3 ring-1 ring-brand/10 transition hover:bg-brand-light"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-brand-ink">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-brand-muted">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_260px]">
            <div className="accent-panel rounded-xl border border-brand/12 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                Why choose Asli Patta
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { label: "Verified listings", icon: BadgeCheck },
                  { label: "Direct seller contact", icon: Phone },
                  { label: "No brokerage", icon: Handshake },
                  { label: "Fast search", icon: Search },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-xs font-bold text-brand-ink ring-1 ring-brand/10"
                    >
                      <Icon className="h-4 w-4 text-brand" strokeWidth={2.5} />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-brand/15 bg-brand-light p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-dark">Post your property</p>
              <h3 className="font-display mt-1 text-base font-extrabold text-brand-ink">Reach buyers faster</h3>
              <p className="mt-1 text-xs leading-5 text-brand-muted">
                Add your property with price, location and photos for better visibility.
              </p>
              <button
                type="button"
                onClick={() => router.push("/add")}
                className="mt-3 min-h-9 rounded-full bg-brand px-4 text-xs font-bold text-white transition hover:bg-brand-dark"
              >
                Post property
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">FAQ</p>
          <div className="mt-3">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <section className="reveal-section accent-panel rounded-2xl border border-brand/15 p-5 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Stay updated</p>
            <h2 className="font-display mt-1 text-lg font-extrabold text-brand-ink sm:text-xl">
              Get plot alerts on WhatsApp
            </h2>
            <p className="mt-1 text-sm text-brand-muted">New listings in your city, delivered instantly.</p>
          </div>
          <a
            href="https://wa.me/919214982277"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/30"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            Connect on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
