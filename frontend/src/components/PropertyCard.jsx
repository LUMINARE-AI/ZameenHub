import { useState } from "react";
import { Link } from "react-router-dom";
import { formatArea, formatPrice } from "../utils/property";
import RatingStars from "./RatingStars";

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
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

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_-28px_rgba(30,64,175,0.32)]">
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          loading={priority ? "eager" : "lazy"}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
            {property.category}
          </span>
          <button
            type="button"
            onClick={() => setSaved((current) => !current)}
            className="rounded-full bg-white/90 p-2 text-slate-900 shadow-sm transition hover:bg-blue-50"
            aria-label="Save property"
          >
            {saved ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold text-slate-950">{formatPrice(property.price)}</p>
            <Link
              to={`/property/${property._id}`}
              className="mt-2 block text-lg font-semibold text-slate-900"
            >
              {property.title}
            </Link>
            <p className="mt-1 text-sm text-slate-500">{property.location}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <RatingStars rating={property.averageRating} />
              <span>{property.averageRating ? property.averageRating.toFixed(1) : "New"}</span>
              <span>·</span>
              <span>{property.numberOfReviews || 0} reviews</span>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
              property.status === "approved"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {property.status === "approved" ? "Approved" : "Pending"}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{property.description}</p>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Beds" value={property.bedrooms} />
          <Stat label="Baths" value={property.bathrooms} />
          <Stat label="Area" value={formatArea(property.area)} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/property/${property._id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View details
            <span aria-hidden="true">-&gt;</span>
          </Link>

          {hasContact ? (
            <a
              href={`tel:${property.contact}`}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Contact Seller
            </a>
          ) : (
            <Link
              to={`/property/${property._id}`}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Request details
            </Link>
          )}
        </div>

        {canDelete ? (
          <button
            type="button"
            onClick={() => onDelete?.(property._id)}
            disabled={deleting}
            className="w-full rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "🗑 Delete"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
