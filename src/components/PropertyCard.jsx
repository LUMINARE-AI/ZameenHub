"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin } from "lucide-react";
import { formatArea, formatPrice } from "@/lib/property";
import RatingStars from "./RatingStars";

function Stat({ label, value }) {
  return (
    <div className="min-w-0 rounded-lg bg-brand-light/60 px-2 py-1.5 ring-1 ring-brand/10">
      <p className="text-[10px] font-semibold uppercase text-brand-muted">{label}</p>
      <p className="truncate text-xs font-semibold text-brand-ink">{value}</p>
    </div>
  );
}

function getCategoryTone(category = "") {
  const normalized = category.toLowerCase();

  if (normalized.includes("commercial") || normalized.includes("shop")) {
    return "bg-amber-50 text-amber-800 ring-amber-200";
  }

  if (normalized.includes("rent") || normalized.includes("pg")) {
    return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  }

  if (normalized.includes("agricultural") || normalized.includes("plot")) {
    return "bg-brand-light text-brand-dark ring-brand/20";
  }

  return "bg-brand-light text-brand ring-brand/20";
}

export default function PropertyCard({
  property,
  priority = false,
  canDelete = false,
  deleting = false,
  onDelete,
  variant = "grid",
}) {
  const [saved, setSaved] = useState(false);
  const hasContact = Boolean(property.contact);
  const detailValue = property.configuration || formatArea(property.area);
  const isList = variant === "list";

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10 ${
        isList ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${isList ? "sm:w-56 shrink-0" : ""}`}>
        <img
          src={property.image}
          alt={property.title}
          loading={priority ? "eager" : "lazy"}
          className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
            isList ? "h-44 sm:h-full sm:min-h-[160px]" : "aspect-[4/3]"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/45 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
          <span
            className={`max-w-[70%] truncate rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ring-1 ${getCategoryTone(property.category)}`}
          >
            {property.category}
          </span>
          <button
            type="button"
            onClick={() => setSaved((current) => !current)}
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition ${
              saved
                ? "bg-rose-500 text-white"
                : "bg-white/95 text-slate-600 hover:bg-brand-light hover:text-brand"
            }`}
            aria-label="Save property"
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} strokeWidth={2.5} />
          </button>
        </div>
        {property.status === "approved" ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-brand shadow-sm">
            <BadgeCheck className="h-3 w-3 text-brand" strokeWidth={2.5} />
            Verified
          </span>
        ) : null}
        <Link
          href={`/property/${property._id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100"
        >
          <span className="rounded-full bg-brand-accent px-4 py-2 text-xs font-bold text-white shadow-lg">
            View Details
          </span>
        </Link>
      </div>

      <div className={`flex flex-1 flex-col space-y-2.5 p-3 ${isList ? "justify-center" : ""}`}>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-display text-lg font-bold text-brand-dark">
              {formatPrice(property.price)}
            </p>
            {property.status !== "approved" ? (
              <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                Pending
              </span>
            ) : null}
          </div>
          <Link
            href={`/property/${property._id}`}
            className="mt-1 line-clamp-1 text-sm font-bold text-brand-ink transition hover:text-brand"
          >
            {property.title}
          </Link>
          <p className="mt-0.5 flex items-center gap-1 line-clamp-1 text-xs font-medium text-brand-muted">
            <MapPin className="h-3 w-3 shrink-0" strokeWidth={2.5} />
            {property.location}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-muted">
            <RatingStars rating={property.averageRating} />
            <span>{property.averageRating ? property.averageRating.toFixed(1) : "New"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Type" value={detailValue} />
          <Stat label="Area" value={formatArea(property.area)} />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
          <Link
            href={`/property/${property._id}`}
            className="inline-flex min-h-8 items-center text-xs font-bold text-brand transition hover:text-brand-dark"
          >
            View
          </Link>

          {hasContact ? (
            <a
              href={`tel:${property.contact}`}
              className="inline-flex min-h-8 items-center rounded-full bg-brand-light px-3 text-xs font-bold text-brand-dark transition hover:bg-brand/15"
            >
              Call
            </a>
          ) : (
            <Link
              href={`/property/${property._id}`}
              className="inline-flex min-h-8 items-center rounded-full bg-brand-light px-3 text-xs font-bold text-brand-dark transition hover:bg-brand/15"
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
