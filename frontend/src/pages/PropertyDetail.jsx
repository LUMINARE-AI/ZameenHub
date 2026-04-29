import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import RatingStars from "../components/RatingStars";
import useProperties from "../hooks/useProperties";
import { formatPrice } from "../utils/property";
import { getStoredUser } from "../utils/auth";
import API from "../services/api";

function InfoPill({ label, value }) {
  return (
    <div className="rounded-[24px] bg-slate-50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default function PropertyDetail() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { properties, loading, refetch } = useProperties();
  const [activeImage, setActiveImage] = useState(0);
  const [showSeller, setShowSeller] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const user = getStoredUser();

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

  const isAdmin = user?.role === "admin";

  const highlightItems = property.highlights?.length
    ? property.highlights
    : [
        `Prime location in ${property.city || property.location}`,
        "Strong investment potential",
        "Easy connectivity to local transport",
        "High demand for nearby amenities",
      ];

  const ownerContact = property.owner?.phone || property.contact;

  async function handleDeleteProperty() {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      setDeleting(true);
      await API.delete(`/properties/${property._id}`);
      setToast({ message: "Property deleted successfully.", tone: "success" });
      setTimeout(() => {
        navigate("/listings");
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[36px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.3)]">
          <div className="relative overflow-hidden rounded-[28px]">
            <img
              src={property.images[activeImage] || property.image}
              alt={property.title}
              className="h-[460px] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent px-6 py-5 text-white">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-sky-300">{property.category}</p>
                <p className="text-xl font-semibold">{property.location}</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <RatingStars rating={property.averageRating} />
                <p className="text-xs text-slate-200">{property.averageRating ? property.averageRating.toFixed(1) : "New"} · {property.numberOfReviews || 0} reviews</p>
              </div>
            </div>
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
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">{property.category}</p>
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

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoPill label="Carpet area" value={property.carpetArea ? `${property.carpetArea} sqft` : "N/A"} />
            <InfoPill label="Configuration" value={property.configuration || "2BHK"} />
            <InfoPill label="Floor" value={property.floorNumber ? `${property.floorNumber}/${property.totalFloors || "-"}` : "N/A"} />
            <InfoPill label="Facing" value={property.facing || "East"} />
          </div>

          <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Property details</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-600">Price per sq.ft</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{property.pricePerSqFt ? `₹${property.pricePerSqFt.toLocaleString("en-IN")}` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Overlooking</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{property.overlooking || "Road"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Property age</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{property.propertyAge || "New"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Listing created</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{new Date(property.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Why you should consider this property</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {highlightItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="rounded-[36px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)] lg:sticky lg:top-28">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Seller contact</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Contact Seller</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Reach the seller directly with one click or reveal full contact details.
          </p>

          <div className="mt-6 space-y-4">
            <Button className="w-full" onClick={() => setShowSeller(true)}>
              Reveal seller details
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={handleDeleteProperty}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "🗑 Delete Property"}
              </Button>
            )}
          </div>

          {showSeller ? (
            <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Seller details</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">
                {property.owner?.name || "Seller name unavailable"}
              </p>
              <p className="mt-2 text-sm text-slate-500">{ownerContact || "Contact not available"}</p>
              {ownerContact ? (
                <a
                  href={`tel:${ownerContact}`}
                  className="mt-4 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Call Seller
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="rounded-[36px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Rate this property</p>
          <div className="mt-4 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`text-3xl transition ${index < rating ? "text-amber-500" : "text-slate-300"}`}
                      onClick={() => setRating(index + 1)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={4}
                  placeholder="Share your experience or review"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <Button onClick={submitRating} disabled={ratingLoading}>
                  {ratingLoading ? "Submitting..." : "Submit Rating"}
                </Button>
              </>
            ) : (
              <p className="text-sm text-slate-500">Login to add a rating and review for this property.</p>
            )}
          </div>
        </div>
      </aside>
      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
