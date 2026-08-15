"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import API from "@/lib/api";
import Button from "@/components/ui/Button";
import StatusBanner from "@/components/StatusBanner";

const emptyForm = {
  name: "",
  role: "",
  quote: "",
  rating: 5,
};

export default function AdminTestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: "info", message: "" });

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const response = await API.get("/home-content");
        if (!active) return;
        setTestimonials(
          Array.isArray(response.data?.testimonials) ? response.data.testimonials : []
        );
      } catch (error) {
        if (!active) return;
        setStatus({
          tone: "error",
          message: error.response?.data?.message || "Unable to load testimonials.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadContent();

    return () => {
      active = false;
    };
  }, []);

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      role: item.role || "",
      quote: item.quote || "",
      rating: item.rating || 5,
    });
  }

  function resetForm() {
    setEditingId("");
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        quote: form.quote.trim(),
        rating: Number(form.rating),
      };

      const response = editingId
        ? await API.put(`/admin/home-content/testimonials/${editingId}`, payload)
        : await API.post("/admin/home-content/testimonials", payload);

      setTestimonials(Array.isArray(response.data?.testimonials) ? response.data.testimonials : []);
      setStatus({
        tone: "success",
        message: editingId ? "Testimonial updated." : "Testimonial added.",
      });
      resetForm();
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to save testimonial.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function removeTestimonial(id) {
    if (!window.confirm("Delete this testimonial?")) {
      return;
    }

    try {
      const response = await API.delete(`/admin/home-content/testimonials/${id}`);
      setTestimonials(Array.isArray(response.data?.testimonials) ? response.data.testimonials : []);
      if (editingId === id) {
        resetForm();
      }
      setStatus({ tone: "success", message: "Testimonial deleted." });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to delete testimonial.",
      });
    }
  }

  return (
    <div className="space-y-4">
      <StatusBanner tone={status.tone} message={status.message} />

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-3xl border border-brand/10 bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Name</label>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Role / city</label>
          <input
            required
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Quote</label>
          <textarea
            required
            rows={3}
            value={form.quote}
            onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-brand/15 px-3 py-2 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Rating</label>
          <select
            value={form.rating}
            onChange={(event) =>
              setForm((current) => ({ ...current, rating: Number(event.target.value) }))
            }
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} star{value === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? "Saving…" : editingId ? "Update testimonial" : "Add testimonial"}
          </Button>
          {editingId ? (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))
        ) : testimonials.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand/20 bg-white px-6 py-10 text-center">
            <p className="font-semibold text-brand-ink">No testimonials yet</p>
          </div>
        ) : (
          testimonials.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-brand/10 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-ink">{item.name}</p>
                  <p className="text-sm text-brand-muted">{item.role}</p>
                </div>
                <div className="flex gap-1 text-brand-accent">
                  {Array.from({ length: item.rating || 0 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-brand-muted">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => startEdit(item)}>
                  Edit
                </Button>
                <button
                  type="button"
                  onClick={() => void removeTestimonial(item._id)}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
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
