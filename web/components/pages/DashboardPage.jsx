"use client";

import { useEffect, useState } from "react";
import StatusBanner from "@/components/StatusBanner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toast from "@/components/ui/Toast";
import API from "@/lib/api";
import { formatPrice, PROPERTY_CATEGORIES } from "@/lib/property";

export default function DashboardPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [toast, setToast] = useState({ message: "", tone: "info" });
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    title: "",
    category: "Plots",
    location: "",
    price: "",
    description: "",
  });

  async function fetchMyProperties() {
    try {
      setLoading(true);
      const response = await API.get("/dashboard/my-properties");
      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to load your properties.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchMyProperties();
  }, []);

  function startEditing(property) {
    setEditingId(property._id);
    setDraft({
      title: property.title || "",
      category: property.category || "Plots",
      location: property.location || "",
      price: property.price || "",
      description: property.description || "",
    });
  }

  function stopEditing() {
    setEditingId(null);
    setDraft({ title: "", category: "Plots", location: "", price: "", description: "" });
  }

  async function saveProperty(id) {
    if (draft.title.trim().length < 5) {
      setStatus({ tone: "error", message: "Title must be at least 5 characters." });
      return;
    }

    if (draft.location.trim().length < 3) {
      setStatus({ tone: "error", message: "Location must be at least 3 characters." });
      return;
    }

    if (draft.description.trim().length < 20) {
      setStatus({ tone: "error", message: "Description must be at least 20 characters." });
      return;
    }

    if (!Number.isFinite(Number(draft.price)) || Number(draft.price) <= 0) {
      setStatus({ tone: "error", message: "Enter a valid property price." });
      return;
    }

    try {
      await API.put(`/properties/${id}`, {
        title: draft.title.trim(),
        category: draft.category,
        location: draft.location.trim(),
        price: Number(draft.price),
        description: draft.description.trim(),
      });
      setStatus({ tone: "success", message: "Property updated successfully." });
      stopEditing();
      await fetchMyProperties();
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to update the property.",
      });
    }
  }

  async function deleteProperty(id) {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    try {
      await API.delete(`/properties/${id}`);
      setStatus({ tone: "success", message: "Property deleted successfully." });
      setToast({ message: "Property deleted successfully.", tone: "success" });
      await fetchMyProperties();
    } catch (error) {
      const message = error.response?.data?.message || "Unable to delete the property.";
      setStatus({ tone: "error", message });
      setToast({ message, tone: "error" });
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-brand">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">My listed properties</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review status, update details, and manage your live submissions.
        </p>
      </section>

      <StatusBanner tone={status.tone} message={status.message} />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-[32px] border border-white/70 bg-white/90"
            />
          ))
        ) : properties.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center md:col-span-2 xl:col-span-3">
            <p className="text-xl font-semibold text-slate-900">No properties added yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Your listings will appear here once published.
            </p>
          </div>
        ) : (
          properties.map((property) => {
            const isEditing = editingId === property._id;

            return (
              <div
                key={property._id}
                className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.26)]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      property.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {property.status || "pending"}
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={draft.title}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, title: event.target.value }))
                      }
                    />
                    <Input
                      value={draft.location}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, location: event.target.value }))
                      }
                    />
                    <select
                      value={draft.category}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, category: event.target.value }))
                      }
                      className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
                    >
                      {PROPERTY_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={draft.price}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, price: event.target.value }))
                      }
                    />
                    <textarea
                      value={draft.description}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, description: event.target.value }))
                      }
                      rows="4"
                      className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
                    />
                    <div className="flex gap-3">
                      <Button type="button" onClick={() => saveProperty(property._id)}>
                        Save
                      </Button>
                      <Button type="button" variant="ghost" onClick={stopEditing}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-slate-950">{property.title}</h2>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">
                      {property.category || "Plots"}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{property.location}</p>
                    <p className="mt-4 text-2xl font-semibold text-slate-950">
                      {formatPrice(property.price)}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{property.description}</p>

                    <div className="mt-6 flex gap-3">
                      <Button type="button" variant="ghost" onClick={() => startEditing(property)}>
                        Edit
                      </Button>
                      <Button type="button" variant="dark" onClick={() => deleteProperty(property._id)}>
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </section>
      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
