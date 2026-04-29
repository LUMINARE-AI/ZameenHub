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

const LAND_FILTER_CATEGORIES = ["Plots", "Commercial Land", "Agricultural Land"];

function canDeleteProperty(user, property) {
  if (!user) {
    return false;
  }

  return user.role === "admin" || property.owner?._id === user._id;
}

export default function Listings({ defaultCategory = "" }) {
  const { properties, loading, error, refetch } = useProperties();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [deletingId, setDeletingId] = useState("");
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const user = getStoredUser();
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    category:
      searchParams.get("category") ||
      (defaultCategory === "plots" ? LAND_FILTER_CATEGORIES : ""),
    type: "",
    bedrooms: "",
    maxPrice: Number(searchParams.get("maxPrice")) || 50000000,
  });

  const categorySelectValue = Array.isArray(filters.category) ? "" : filters.category;

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
    <div className="grid gap-4 lg:grid-cols-[270px_1fr]">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Filters</p>
        <h1 className="mt-1 text-xl font-extrabold text-slate-950">Find land and plots</h1>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600">Location</label>
            <input
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              placeholder="City or locality"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">Category</label>
            <select
              value={categorySelectValue}
              onChange={(event) => updateFilter("category", event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            <label className="text-xs font-bold text-slate-600">
              Max price: INR {Math.round(filters.maxPrice / 10000000)} Cr
            </label>
            <input
              type="range"
              min="5000000"
              max="50000000"
              step="500000"
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", Number(event.target.value))}
              className="mt-2 w-full accent-blue-600"
            />
          </div>

          <div className="rounded-xl bg-blue-50 p-3">
            <p className="text-xs font-bold uppercase text-blue-900">Popular buy categories</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => updateFilter("category", category)}
                  className="min-h-9 rounded-full bg-white px-3 text-xs font-bold text-slate-700 ring-1 ring-blue-100"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Marketplace</p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">
              Approved plots, land and spaces
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? "Loading listings..." : `${filteredProperties.length} backend listings found`}
            </p>
          </div>

          <div className="sm:min-w-48">
            <label className="text-xs font-bold text-slate-600">Sort by</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
            </select>
          </div>
        </div>

        {error ? <StatusBanner tone="error" message={error} /> : null}
        <StatusBanner tone={status.tone} message={status.message} />

        <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => <PropertySkeleton key={index} />)
            : filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  priority={index < 3}
                  canDelete={canDeleteProperty(user, property)}
                  deleting={deletingId === property._id}
                  onDelete={handleDeleteProperty}
                />
              ))}
        </div>

        {!loading && filteredProperties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="text-lg font-bold text-slate-900">No properties found</p>
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
