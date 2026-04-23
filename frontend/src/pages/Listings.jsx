import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertySkeleton from "../components/PropertySkeleton";
import StatusBanner from "../components/StatusBanner";
import Toast from "../components/ui/Toast";
import API from "../services/api";
import useProperties from "../hooks/useProperties";
import { getStoredUser } from "../utils/auth";
import {
  BUY_CATEGORIES,
  PROPERTY_CATEGORIES,
  filterProperties,
  sortProperties,
} from "../utils/property";

function canDeleteProperty(user, property) {
  if (!user) {
    return false;
  }

  return user.role === "admin" || property.owner?._id === user._id;
}

export default function Listings() {
  const { properties, loading, error, refetch } = useProperties();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [deletingId, setDeletingId] = useState("");
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const user = getStoredUser();
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    type: "",
    bedrooms: "",
    maxPrice: Number(searchParams.get("maxPrice")) || 50000000,
  });

  const filteredProperties = useMemo(() => {
    const filtered = filterProperties(properties, filters);
    return sortProperties(filtered, sortBy);
  }, [filters, properties, sortBy]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function handleDeleteProperty(id) {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    try {
      setDeletingId(id);
      setStatus({ tone: "info", message: "" });
      await API.delete(`/properties/${id}`);
      setStatus({ tone: "success", message: "Property deleted successfully." });
      setToast({ message: "Property deleted successfully.", tone: "success" });
      await refetch();
    } catch (deleteError) {
      const message =
        deleteError.response?.data?.message || "Unable to delete this property.";
      setStatus({ tone: "error", message });
      setToast({ message, tone: "error" });
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)] lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Filters</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">Find land and plots</h1>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-600">Location</label>
            <input
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              placeholder="City or locality"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Category</label>
            <select
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All categories</option>
              {PROPERTY_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Max price: ₹{Math.round(filters.maxPrice / 10000000)} Cr
            </label>
            <input
              type="range"
              min="5000000"
              max="50000000"
              step="500000"
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", Number(event.target.value))}
              className="mt-3 w-full accent-blue-600"
            />
          </div>

          <div className="rounded-3xl bg-blue-50 p-4">
            <p className="text-sm font-bold text-blue-900">Popular buy categories</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {BUY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => updateFilter("category", category)}
                  className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-blue-100"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Marketplace</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Approved plots, land and spaces
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {loading ? "Loading listings..." : `${filteredProperties.length} backend listings found`}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Sort by</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
            </select>
          </div>
        </div>

        {error ? <StatusBanner tone="error" message={error} /> : null}
        <StatusBanner tone={status.tone} message={status.message} />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <PropertySkeleton key={index} />)
            : filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  priority={index < 2}
                  canDelete={canDeleteProperty(user, property)}
                  deleting={deletingId === property._id}
                  onDelete={handleDeleteProperty}
                />
              ))}
        </div>

        {!loading && filteredProperties.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
            <p className="text-xl font-semibold text-slate-900">No properties found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try widening the budget or changing the property type.
            </p>
          </div>
        ) : null}
      </section>
      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
