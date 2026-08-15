"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Button from "@/components/ui/Button";
import StatusBanner from "@/components/StatusBanner";
import { formatPrice } from "@/lib/property";

export default function AdminPendingSection() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchPending() {
      try {
        const response = await API.get("/admin/properties/pending");
        if (!active) return;
        setProperties(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (!active) return;
        setStatus({
          tone: "error",
          message: error.response?.data?.message || "Unable to load pending properties.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchPending();

    return () => {
      active = false;
    };
  }, []);

  async function refreshPending() {
    try {
      setLoading(true);
      const response = await API.get("/admin/properties/pending");
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to load pending properties.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    try {
      setBusyId(id);
      await API.put(`/admin/properties/${id}/approve`, {});
      setStatus({ tone: "success", message: "Property approved successfully." });
      await refreshPending();
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Approval failed.",
      });
    } finally {
      setBusyId("");
    }
  }

  async function deleteProperty(id) {
    try {
      setBusyId(id);
      await API.delete(`/admin/properties/${id}`);
      setStatus({ tone: "success", message: "Property deleted successfully." });
      await refreshPending();
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Delete failed.",
      });
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-4">
      <StatusBanner tone={status.tone} message={status.message} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-3xl border border-brand/10 bg-white"
            />
          ))
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand/20 bg-white px-6 py-12 text-center md:col-span-2 xl:col-span-3">
            <p className="text-xl font-semibold text-brand-ink">No pending properties</p>
            <p className="mt-2 text-sm text-brand-muted">
              New submissions will show up here for review.
            </p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property._id}
              className="rounded-3xl border border-brand/10 bg-white p-5 shadow-sm"
            >
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Pending
              </span>
              <h2 className="mt-4 text-lg font-semibold text-brand-ink">{property.title}</h2>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">
                {property.category || "Plots"}
              </p>
              <p className="mt-2 text-sm text-brand-muted">{property.location}</p>
              <p className="mt-4 text-2xl font-semibold text-brand-ink">
                {formatPrice(property.price)}
              </p>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-brand-muted">
                {property.description}
              </p>
              <div className="mt-4 rounded-2xl bg-brand-light/60 px-4 py-3 text-sm text-brand-muted">
                Owner: {property.owner?.name || "Unknown"}
                {property.owner?.phone ? ` • ${property.owner.phone}` : ""}
              </div>
              <div className="mt-5 flex gap-3">
                <Button
                  onClick={() => approve(property._id)}
                  disabled={busyId === property._id}
                >
                  Approve
                </Button>
                <button
                  type="button"
                  disabled={busyId === property._id}
                  onClick={() => {
                    if (window.confirm("Delete this property?")) {
                      void deleteProperty(property._id);
                    }
                  }}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
