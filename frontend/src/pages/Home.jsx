import { useMemo } from "react";
import PropertyCard from "../components/PropertyCard";
import PropertySkeleton from "../components/PropertySkeleton";
import useProperties from "../hooks/useProperties";

export default function Home() {
  const { properties, loading, error } = useProperties();

  // Sort by newest first (similar to Listings page default)
  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [properties]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Home</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          All Approved Property Listings
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {loading ? "Loading listings..." : `${sortedProperties.length} properties available`}
        </p>
      </div>

      {error ? (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-semibold text-red-900">Unable to load properties</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 9 }).map((_, index) => <PropertySkeleton key={index} />)
            : sortedProperties.map((property, index) => (
                <PropertyCard key={property._id} property={property} priority={index < 2} />
              ))}
        </div>
      )}

      {!loading && !error && sortedProperties.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
          <p className="text-xl font-semibold text-slate-900">No properties found</p>
          <p className="mt-2 text-sm text-slate-500">
            Approved property listings will appear here.
          </p>
        </div>
      ) : null}
    </div>
  );
}
