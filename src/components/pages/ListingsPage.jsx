"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Grid3x3, Home, List, SlidersHorizontal, X } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import PropertySkeleton from "@/components/PropertySkeleton";
import StatusBanner from "@/components/StatusBanner";
import Toast from "@/components/ui/Toast";
import API from "@/lib/api";
import useProperties from "@/hooks/useProperties";
import useDbUser from "@/hooks/useDbUser";
import {
  BUY_CATEGORIES,
  PROPERTY_CATEGORIES,
  filterProperties,
  sortProperties,
} from "@/lib/property";

const LAND_FILTER_CATEGORIES = ["Plots", "Commercial Land", "Agricultural Land"];

function canDeleteProperty(user, property) {
  if (!user) {
    return false;
  }

  return user.role === "admin" || property.owner?._id === user._id;
}

function FilterPanel({ filters, categorySelectValue, updateFilter, onClose }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-brand-muted">Location</label>
        <input
          value={filters.location}
          onChange={(event) => updateFilter("location", event.target.value)}
          placeholder="City or locality"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-brand-muted">Category</label>
        <select
          value={categorySelectValue}
          onChange={(event) => updateFilter("category", event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
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
        <label className="text-xs font-bold text-brand-muted">
          Max price: INR {Math.round(filters.maxPrice / 10000000)} Cr
        </label>
        <input
          type="range"
          min="5000000"
          max="50000000"
          step="500000"
          value={filters.maxPrice}
          onChange={(event) => updateFilter("maxPrice", Number(event.target.value))}
          className="mt-2 w-full accent-brand"
        />
      </div>

      <div className="rounded-xl bg-brand-light p-3">
        <p className="text-xs font-bold uppercase text-brand-dark">Popular buy categories</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BUY_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => updateFilter("category", category)}
              className="min-h-9 rounded-full bg-white px-3 text-xs font-bold text-brand-ink ring-1 ring-brand/15 transition hover:bg-brand/10"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          Apply filters
        </button>
      ) : null}
    </div>
  );
}

export default function ListingsPage({ defaultCategory = "" }) {
  const { properties, loading, error, refetch } = useProperties();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const { user } = useDbUser();
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

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.location) chips.push({ key: "location", label: filters.location });
    if (categorySelectValue) chips.push({ key: "category", label: categorySelectValue });
    if (filters.maxPrice < 50000000) {
      chips.push({
        key: "maxPrice",
        label: `Under ₹${(filters.maxPrice / 10000000).toFixed(1)} Cr`,
      });
    }
    return chips;
  }, [filters.location, filters.maxPrice, categorySelectValue]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function removeChip(key) {
    if (key === "location") updateFilter("location", "");
    if (key === "category") updateFilter("category", "");
    if (key === "maxPrice") updateFilter("maxPrice", 50000000);
  }

  function clearAllFilters() {
    setFilters({
      location: "",
      category: defaultCategory === "plots" ? LAND_FILTER_CATEGORIES : "",
      type: "",
      bedrooms: "",
      maxPrice: 50000000,
    });
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
      <aside className="hidden h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:block">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Filters</p>
        <h1 className="font-display mt-1 text-xl font-extrabold text-brand-ink">Find land and plots</h1>
        <div className="mt-4">
          <FilterPanel
            filters={filters}
            categorySelectValue={categorySelectValue}
            updateFilter={updateFilter}
          />
        </div>
      </aside>

      {filterOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-3 bottom-3 top-20 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-brand-ink">Filters</h2>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              categorySelectValue={categorySelectValue}
              updateFilter={updateFilter}
              onClose={() => setFilterOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Marketplace</p>
            <h2 className="font-display mt-1 text-xl font-extrabold text-brand-ink sm:text-2xl">
              Approved plots, land and spaces
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              {loading ? "Loading listings..." : `${filteredProperties.length} listings found`}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-brand-ink transition hover:bg-brand-light lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={2.5} />
              Filters
            </button>

            <div className="flex rounded-xl border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  viewMode === "grid" ? "bg-brand text-white" : "text-brand-muted hover:bg-brand-light"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  viewMode === "list" ? "bg-brand text-white" : "text-brand-muted hover:bg-brand-light"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            <div className="sm:min-w-44">
              <label className="text-xs font-bold text-brand-muted">Sort by</label>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
              </select>
            </div>
          </div>
        </div>

        {activeChips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeChip(chip.key)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-xs font-bold text-brand-dark ring-1 ring-brand/15 transition hover:bg-brand/15"
              >
                {chip.label}
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-bold text-brand transition hover:text-brand-dark"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {error ? <StatusBanner tone="error" message={error} /> : null}
        <StatusBanner tone={status.tone} message={status.message} />

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              : "flex flex-col gap-3"
          }
        >
          {loading
            ? Array.from({ length: 10 }).map((_, index) => <PropertySkeleton key={index} />)
            : filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  priority={index < 3}
                  variant={viewMode}
                  canDelete={canDeleteProperty(user, property)}
                  deleting={deletingId === property._id}
                  onDelete={handleDeleteProperty}
                />
              ))}
        </div>

        {!loading && filteredProperties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand/25 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand">
              <Home className="h-8 w-8" strokeWidth={2} />
            </div>
            <p className="mt-4 text-lg font-bold text-brand-ink">No properties found</p>
            <p className="mt-2 text-sm text-brand-muted">
              Try widening the budget or changing the property type.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </section>
      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
