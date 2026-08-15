"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Button from "@/components/ui/Button";
import StatusBanner from "@/components/StatusBanner";
import { formatPrice } from "@/lib/property";

export default function AdminFeaturedSection() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      try {
        const response = await API.get("/admin/properties/approved");
        if (!active) return;
        setProperties(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (!active) return;
        setStatus({
          tone: "error",
          message: error.response?.data?.message || "Unable to load approved properties.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProperties();

    return () => {
      active = false;
    };
  }, []);

  async function refreshProperties(nextSearch = search) {
    try {
      setLoading(true);
      const response = await API.get("/admin/properties/approved", {
        params: { search: nextSearch || undefined },
      });
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to load approved properties.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeatured(property) {
    try {
      setBusyId(property._id);
      const response = await API.put(`/admin/properties/${property._id}/featured`, {
        featured: !property.featured,
      });
      setStatus({
        tone: "success",
        message: response.data?.message || "Featured status updated.",
      });
      await refreshProperties();
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to update featured status.",
      });
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-4">
      <StatusBanner tone={status.tone} message={status.message} />

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void refreshProperties(search);
        }}
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search approved listings…"
          className="min-h-11 w-full flex-1 rounded-xl border border-brand/15 bg-white px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <p className="text-sm text-brand-muted">
        Homepage shows up to 10 featured listings. If none are featured, newest approved listings
        are shown instead.
      </p>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand/20 bg-white px-6 py-10 text-center">
            <p className="font-semibold text-brand-ink">No approved properties found</p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property._id}
              className="flex flex-col gap-4 rounded-2xl border border-brand/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold text-brand-ink">{property.title}</h3>
                  {property.featured ? (
                    <span className="rounded-full bg-brand-accent-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-accent-dark">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-brand-muted">
                  {property.category} · {property.location} · {formatPrice(property.price)}
                </p>
              </div>
              <Button
                variant={property.featured ? "secondary" : "primary"}
                disabled={busyId === property._id}
                onClick={() => void toggleFeatured(property)}
                className="shrink-0"
              >
                {busyId === property._id
                  ? "Saving…"
                  : property.featured
                    ? "Remove featured"
                    : "Make featured"}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
