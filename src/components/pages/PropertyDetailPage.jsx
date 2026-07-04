"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Circle, MapPin, Phone, Star, X } from "lucide-react";
import Button from "@/components/ui/Button";
import PropertyCard from "@/components/PropertyCard";
import Toast from "@/components/ui/Toast";
import RatingStars from "@/components/RatingStars";
import useProperties from "@/hooks/useProperties";
import useDbUser from "@/hooks/useDbUser";
import { formatPrice } from "@/lib/property";
import { buildGoogleMapsEmbedUrl } from "@/lib/maps";
import { useAuthUI } from "@/context/AuthUIContext";
import API from "@/lib/api";

function RatingSection({
  property,
  user,
  rating,
  setRating,
  comment,
  setComment,
  ratingLoading,
  onSubmit,
  onLogin,
  compact = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-brand-light/50 px-4 py-3 ring-1 ring-brand/10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">Community rating</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-ink">
            {property.averageRating ? property.averageRating.toFixed(1) : "—"}
          </p>
        </div>
        <div className="text-right">
          <RatingStars rating={property.averageRating} className="justify-end" />
          <p className="mt-1 text-xs text-brand-muted">
            {property.numberOfReviews || 0}{" "}
            {property.numberOfReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {user ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-brand-ink">Your rating</p>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className="rounded-lg p-1 transition hover:scale-110"
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHoverRating(index + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${index + 1} stars`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      index < displayRating
                        ? "fill-brand-accent text-brand-accent"
                        : "text-slate-300"
                    }`}
                    strokeWidth={1.75}
                  />
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-brand-muted">
              {rating ? `You selected ${rating} star${rating > 1 ? "s" : ""}` : "Tap a star to rate"}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-ink" htmlFor={`property-review-${compact ? "sidebar" : "main"}`}>
              Your review
            </label>
            <textarea
              id={`property-review-${compact ? "sidebar" : "main"}`}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              placeholder="Share your experience with this property..."
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>

          <Button className="w-full" onClick={onSubmit} disabled={ratingLoading || !rating}>
            {ratingLoading ? "Submitting..." : "Submit review"}
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-brand/20 bg-white px-4 py-5 text-center">
          <Star className="mx-auto h-8 w-8 text-brand-accent" strokeWidth={1.75} />
          <p className="mt-3 text-sm font-semibold text-brand-ink">Share your experience</p>
          <p className="mt-1 text-sm text-brand-muted">Sign in to rate and review this listing.</p>
          <Button className="mt-4 w-full" variant="accent" onClick={onLogin}>
            Sign in to rate
          </Button>
        </div>
      )}
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-brand-light/60 px-4 py-4 ring-1 ring-brand/10">
      <p className="text-xs uppercase tracking-[0.18em] text-brand-muted">{label}</p>
      <p className="mt-2 text-base font-semibold text-brand-ink">{value}</p>
    </div>
  );
}

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.propertyId;
  const { properties, loading, refetch } = useProperties();
  const { user } = useDbUser();
  const { handleUserIconClick } = useAuthUI();
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showSeller, setShowSeller] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);

  const property = useMemo(
    () => properties.find((item) => item._id === propertyId),
    [properties, propertyId]
  );

  const similarProperties = useMemo(() => {
    if (!property) return [];
    return properties
      .filter(
        (item) =>
          item._id !== property._id &&
          (item.category === property.category ||
            item.city === property.city ||
            item.location?.includes(property.city || ""))
      )
      .slice(0, 4);
  }, [properties, property]);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="h-[420px] animate-shimmer rounded-3xl" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-shimmer rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="h-[420px] animate-shimmer rounded-3xl" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="rounded-3xl border border-white/70 bg-white/90 px-6 py-14 text-center shadow-[0_24px_70px_-32px_rgba(15,92,72,0.2)]">
        <p className="font-display text-2xl font-semibold text-brand-ink">Property not found</p>
        <p className="mt-2 text-sm text-brand-muted">
          The listing may have moved, or the link may be outdated.
        </p>
        <Link href="/listings" className="mt-6 inline-flex">
          <Button>Back to listings</Button>
        </Link>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const images =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : [property.image].filter(Boolean);
  const activeImageSrc = images[activeImage] || images[0] || property.image;

  const highlightItems = property.highlights?.length
    ? property.highlights
    : [
        `Prime location in ${property.city || property.location}`,
        "Strong investment potential",
        "Easy connectivity to local transport",
        "High demand for nearby amenities",
      ];

  const ownerContact = property.owner?.phone || property.contact;
  const mapSrc = buildGoogleMapsEmbedUrl({
    lat: property.latitude,
    lng: property.longitude,
    query: property.location || property.city || "",
  });

  function nextImage() {
    setActiveImage((current) => (current + 1) % images.length);
  }

  function prevImage() {
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  }

  async function handleDeleteProperty() {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      setDeleting(true);
      await API.delete(`/properties/${property._id}`);
      setToast({ message: "Property deleted successfully.", tone: "success" });
      setTimeout(() => {
        router.push("/listings");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to delete this property.";
      setToast({ message, tone: "error" });
    } finally {
      setDeleting(false);
    }
  }

  async function submitRating() {
    if (!rating) {
      setToast({ message: "Pick a star rating first.", tone: "error" });
      return;
    }

    if (!user) {
      setToast({ message: "Login to rate this property.", tone: "error" });
      return;
    }

    try {
      setRatingLoading(true);
      await API.post(`/properties/${property._id}/rate`, { rating, comment });
      await refetch();
      setToast({ message: "Thanks for your rating!", tone: "success" });
      setComment("");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to submit rating.";
      setToast({ message, tone: "error" });
    } finally {
      setRatingLoading(false);
    }
  }

  return (
    <>
      <div className="grid gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:pb-0">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_24px_70px_-32px_rgba(15,92,72,0.2)]">
            <div className="relative overflow-hidden rounded-2xl">
              <button type="button" onClick={() => setLightboxOpen(true)} className="block w-full">
                <img
                  src={activeImageSrc}
                  alt={property.title}
                  className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[460px]"
                />
              </button>
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent px-4 py-4 text-white sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-accent">{property.category}</p>
                  <p className="font-display text-2xl font-bold">{formatPrice(property.price)}</p>
                  <p className="text-sm text-white/80">{property.location}</p>
                </div>
                <div className="w-fit rounded-2xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                  <RatingStars rating={property.averageRating} />
                  <p className="text-xs text-white/70">
                    {property.averageRating ? property.averageRating.toFixed(1) : "New"} ·{" "}
                    {property.numberOfReviews || 0} reviews
                  </p>
                </div>
              </div>
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                </>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    activeImage === index ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className="h-16 w-full object-cover sm:h-20"
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,92,72,0.18)] sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-brand">
                  {property.category}
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold text-brand-ink">{property.title}</h1>
                <p className="mt-2 flex items-center gap-1 text-sm text-brand-muted">
                  <MapPin className="h-4 w-4" strokeWidth={2.5} />
                  {property.location}
                </p>
              </div>

              <div className="space-y-3 sm:text-right">
                <p className="font-display text-3xl font-semibold text-brand-dark">
                  {formatPrice(property.price)}
                </p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                    property.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {property.status === "approved" ? "Approved" : "Pending"}
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoPill
                label="Carpet area"
                value={property.carpetArea ? `${property.carpetArea} sqft` : "N/A"}
              />
              <InfoPill label="Configuration" value={property.configuration || "2BHK"} />
              <InfoPill
                label="Floor"
                value={
                  property.floorNumber
                    ? `${property.floorNumber}/${property.totalFloors || "-"}`
                    : "N/A"
                }
              />
              <InfoPill label="Facing" value={property.facing || "East"} />
            </div>

            <div className="mt-8 rounded-2xl bg-brand-light/40 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-muted">
                Property details
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-brand-muted">Price per sq.ft</p>
                  <p className="mt-2 text-lg font-semibold text-brand-ink">
                    {property.pricePerSqFt
                      ? `₹${property.pricePerSqFt.toLocaleString("en-IN")}`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-muted">Overlooking</p>
                  <p className="mt-2 text-lg font-semibold text-brand-ink">
                    {property.overlooking || "Road"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-muted">Property age</p>
                  <p className="mt-2 text-lg font-semibold text-brand-ink">
                    {property.propertyAge || "New"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-muted">Listing created</p>
                  <p className="mt-2 text-lg font-semibold text-brand-ink">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-brand/10">
              <div className="flex items-center gap-2 bg-brand-light px-4 py-3">
                <MapPin className="h-4 w-4 text-brand" strokeWidth={2.5} />
                <p className="text-sm font-bold text-brand-ink">Location</p>
              </div>
              <iframe
                title="Property location map"
                src={mapSrc}
                className="h-48 w-full border-0 sm:h-56"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mt-8 rounded-2xl border border-brand/10 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-muted">
                Why you should consider this property
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-brand-muted">
                {highlightItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Circle className="mt-2 h-1.5 w-1.5 shrink-0 fill-brand text-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,92,72,0.18)] lg:hidden">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-brand">Rate this property</p>
            <h2 className="font-display mt-2 text-xl font-semibold text-brand-ink">Reviews & ratings</h2>
            <div className="mt-5">
              <RatingSection
                property={property}
                user={user}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                ratingLoading={ratingLoading}
                onSubmit={submitRating}
                onLogin={handleUserIconClick}
              />
            </div>
          </section>

          {similarProperties.length > 0 ? (
            <section className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Similar</p>
                <h2 className="font-display text-xl font-extrabold text-brand-ink">You may also like</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 min-[500px]:grid-cols-2">
                {similarProperties.map((item) => (
                  <PropertyCard key={item._id} property={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--navbar-offset)+1rem)] space-y-0 overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_24px_70px_-32px_rgba(15,92,72,0.18)]">
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-brand">Seller contact</p>
              <h2 className="font-display mt-3 text-2xl font-semibold text-brand-ink">Contact Seller</h2>
              <p className="mt-3 text-sm leading-6 text-brand-muted">
                Reach the seller directly with one click or reveal full contact details.
              </p>

              <div className="mt-6 space-y-3">
                <Button className="w-full" onClick={() => setShowSeller(true)}>
                  Reveal seller details
                </Button>
                {ownerContact ? (
                  <a href={`tel:${ownerContact}`} className="block">
                    <Button variant="accent" className="w-full">
                      <Phone className="mr-2 h-4 w-4" strokeWidth={2.5} />
                      Call Seller
                    </Button>
                  </a>
                ) : null}
                {isAdmin ? (
                  <Button
                    variant="ghost"
                    className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={handleDeleteProperty}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete Property"}
                  </Button>
                ) : null}
              </div>

              {showSeller ? (
                <div className="mt-6 rounded-2xl border border-brand/10 bg-brand-light/30 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-muted">
                    Seller details
                  </p>
                  <p className="mt-3 text-lg font-semibold text-brand-ink">
                    {property.owner?.name || "Seller name unavailable"}
                  </p>
                  <p className="mt-2 text-sm text-brand-muted">{ownerContact || "Contact not available"}</p>
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-100 bg-gradient-to-b from-brand-light/30 to-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-brand">Rate this property</p>
              <h3 className="font-display mt-2 text-lg font-semibold text-brand-ink">Leave a review</h3>
              <div className="mt-5">
                <RatingSection
                  property={property}
                  user={user}
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  ratingLoading={ratingLoading}
                  onSubmit={submitRating}
                  onLogin={handleUserIconClick}
                  compact
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-brand/10 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,92,72,0.1)] backdrop-blur-xl lg:hidden">
        <Button className="flex-1" onClick={() => setShowSeller(true)}>
          Contact Seller
        </Button>
        {ownerContact ? (
          <a href={`tel:${ownerContact}`} className="flex-1">
            <Button variant="accent" className="w-full">
              <Phone className="mr-1 h-4 w-4" strokeWidth={2.5} />
              Call
            </Button>
          </a>
        ) : null}
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
              </button>
            </>
          ) : null}
          <img
            src={activeImageSrc}
            alt={property.title}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      ) : null}

      <Toast message={toast.message} tone={toast.tone} />
    </>
  );
}
