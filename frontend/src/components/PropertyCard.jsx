import { useState } from "react";
import { Link } from "react-router-dom";
import { formatArea, formatPrice } from "../utils/property";
import RatingStars from "./RatingStars";

function Stat({ label, value }) {
  return (
    <div className="min-w-0 rounded-md bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
      <p className="text-[10px] font-semibold uppercase text-slate-400">{label}</p>
      <p className="truncate text-xs font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function getCategoryTone(category = "") {
  const normalized = category.toLowerCase();

  if (normalized.includes("commercial") || normalized.includes("shop")) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  if (normalized.includes("rent") || normalized.includes("pg")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  return "bg-blue-50 text-blue-700 ring-blue-100";
}

export default function PropertyCard({
  property,
  priority = false,
  canDelete = false,
  deleting = false,
  onDelete,
}) {
  const [saved, setSaved] = useState(false);
  const hasContact = Boolean(property.contact);
  const detailValue = property.configuration || formatArea(property.area);

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/80">
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          loading={priority ? "eager" : "lazy"}
          className="h-28 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[120px] xl:h-28"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-1.5">
          <span className={`max-w-[75%] truncate rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${getCategoryTone(property.category)}`}>
            {property.category}
          </span>
          <button
            type="button"
            onClick={() => setSaved((current) => !current)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-blue-50"
            aria-label="Save property"
          >
            {saved ? "S" : "+"}
          </button>
        </div>
      </div>

      <div className="space-y-2 p-2.5">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-base font-extrabold text-blue-700">{formatPrice(property.price)}</p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                property.status === "approved"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {property.status === "approved" ? "Ok" : "Pending"}
            </span>
          </div>
          <Link
            to={`/property/${property._id}`}
            className="mt-1 line-clamp-1 text-sm font-bold text-slate-950 transition hover:text-blue-700"
          >
            {property.title}
          </Link>
          <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-500">{property.location}</p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <RatingStars rating={property.averageRating} />
            <span>{property.averageRating ? property.averageRating.toFixed(1) : "New"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Type" value={detailValue} />
          <Stat label="Area" value={formatArea(property.area)} />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-1.5">
          <Link
            to={`/property/${property._id}`}
            className="inline-flex min-h-8 items-center text-xs font-bold text-blue-700 transition hover:text-blue-800"
          >
            View
          </Link>

          {hasContact ? (
            <a
              href={`tel:${property.contact}`}
              className="inline-flex min-h-8 items-center rounded-full bg-slate-100 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Call
            </a>
          ) : (
            <Link
              to={`/property/${property._id}`}
              className="inline-flex min-h-8 items-center rounded-full bg-slate-100 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Details
            </Link>
          )}
        </div>

        {canDelete ? (
          <button
            type="button"
            onClick={() => onDelete?.(property._id)}
            disabled={deleting}
            className="w-full rounded-full bg-rose-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
