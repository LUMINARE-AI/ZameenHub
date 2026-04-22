import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import useProperties from "../hooks/useProperties";
import { formatArea, formatPrice } from "../utils/property";

function InfoPill({ label, value }) {
  return (
    <div className="rounded-[24px] bg-slate-50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default function PropertyDetail() {
  const { propertyId } = useParams();
  const { properties, loading } = useProperties();
  const [activeImage, setActiveImage] = useState(0);

  const property = useMemo(
    () => properties.find((item) => item._id === propertyId),
    [properties, propertyId]
  );

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="h-[420px] animate-pulse rounded-[36px] bg-slate-200" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-[24px] bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="h-[420px] animate-pulse rounded-[36px] bg-white/80" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="rounded-[36px] border border-white/70 bg-white/90 px-6 py-14 text-center shadow-[0_24px_70px_-32px_rgba(15,23,42,0.3)]">
        <p className="text-2xl font-semibold text-slate-950">Property not found</p>
        <p className="mt-2 text-sm text-slate-500">
          The listing may have moved, or the link may be outdated.
        </p>
        <Link to="/listings" className="mt-6 inline-flex">
          <Button>Back to listings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[36px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.3)]">
          <div className="relative overflow-hidden rounded-[28px]">
            <img
              src={property.images[activeImage] || property.image}
              alt={property.title}
              className="h-[460px] w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {property.images.slice(0, 3).map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-[24px] border transition ${
                  activeImage === index ? "border-blue-500" : "border-transparent"
                }`}
              >
                <img src={image} alt={`${property.title} ${index + 1}`} className="h-28 w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-white/90 p-7 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">{property.type}</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">{property.title}</h1>
              <p className="mt-2 text-sm text-slate-500">{property.location}</p>
            </div>

            <div className="space-y-3 text-right">
              <p className="text-3xl font-semibold text-slate-950">{formatPrice(property.price)}</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${property.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {property.status === "approved" ? "Approved" : "Pending"}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <InfoPill label="Bedrooms" value={`${property.bedrooms} BHK`} />
            <InfoPill label="Bathrooms" value={property.bathrooms} />
            <InfoPill label="Area" value={formatArea(property.area)} />
          </div>

          <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Description
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{property.description}</p>
          </div>

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Map</p>
            <div className="mt-4 flex h-56 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,_#dbeafe,_#eff6ff_40%,_#e2e8f0)] text-sm text-slate-600">
              Interactive map placeholder for {property.city}
            </div>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-[36px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)] lg:sticky lg:top-28">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">
          Quick actions
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Connect with an agent</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Schedule a visit, request a brochure, or ask for negotiation guidance on this
          property.
        </p>

        <div className="mt-6 space-y-4">
          <Button className="w-full">Contact agent</Button>
          <Button variant="secondary" className="w-full">
            Schedule tour
          </Button>
          <Button variant="ghost" className="w-full">
            Save property
          </Button>
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Seller details</p>
          <p className="mt-3 text-lg font-semibold text-slate-950">
            {property.owner?.name || "Listing seller"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {property.owner?.phone || property.contact || "Phone unavailable"}
          </p>
          {property.owner?.phone ? (
            <a
              href={`tel:${property.owner.phone}`}
              className="mt-4 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Call seller
            </a>
          ) : null}
        </div>

        <div className="mt-8 rounded-[28px] bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Agent hotline</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{property.contact || "Contact not available"}</p>
          <p className="mt-2 text-sm text-slate-500">
            Available every day from 9:00 AM to 8:00 PM.
          </p>
        </div>
      </aside>
    </div>
  );
}
