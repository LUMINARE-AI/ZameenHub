"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Button from "@/components/ui/Button";
import StatusBanner from "@/components/StatusBanner";
import { DEFAULT_FOOTER_SETTINGS } from "@/lib/homeContentDefaults";

function toForm(settings = {}) {
  return {
    phone: settings.phone || "",
    email: settings.email || "",
    whatsapp: settings.whatsapp || "",
    address: settings.address || "",
    instagram: settings.instagram || "",
    facebook: settings.facebook || "",
    twitter: settings.twitter || "",
  };
}

export default function AdminFooterSection() {
  const [form, setForm] = useState(() => toForm(DEFAULT_FOOTER_SETTINGS));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: "info", message: "" });

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const response = await API.get("/home-content");
        if (!active) return;
        setForm(toForm(response.data?.footerSettings));
      } catch (error) {
        if (!active) return;
        setStatus({
          tone: "error",
          message: error.response?.data?.message || "Unable to load footer settings.",
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

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        phone: form.phone.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        address: form.address.trim(),
        instagram: form.instagram.trim(),
        facebook: form.facebook.trim(),
        twitter: form.twitter.trim(),
      };

      const response = await API.put("/admin/home-content/footer", payload);
      setForm(toForm(response.data?.footerSettings));
      setStatus({ tone: "success", message: "Footer settings saved." });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Unable to save footer settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StatusBanner tone={status.tone} message={status.message} />

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-3xl border border-brand/10 bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="support@aslipatta.com"
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+91 98765 43210"
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">
            WhatsApp (with country code)
          </label>
          <input
            type="tel"
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            placeholder="919214982277"
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
          <p className="mt-1 text-xs text-brand-muted">Digits only preferred, e.g. 9198XXXXXXXX</p>
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wide text-brand">
            Office address
          </label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="Street, city, state, PIN"
            className="mt-1 w-full rounded-xl border border-brand/15 px-3 py-2 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Instagram</label>
          <input
            type="url"
            value={form.instagram}
            onChange={(event) => updateField("instagram", event.target.value)}
            placeholder="https://instagram.com/..."
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Facebook</label>
          <input
            type="url"
            value={form.facebook}
            onChange={(event) => updateField("facebook", event.target.value)}
            placeholder="https://facebook.com/..."
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-brand">Twitter / X</label>
          <input
            type="url"
            value={form.twitter}
            onChange={(event) => updateField("twitter", event.target.value)}
            placeholder="https://x.com/..."
            className="mt-1 min-h-11 w-full rounded-xl border border-brand/15 px-3 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? "Saving…" : "Save footer settings"}
          </Button>
        </div>
      </form>

      <p className="text-sm text-brand-muted">
        Empty optional fields stay hidden in the public footer. Keep at least an email or WhatsApp
        number.
      </p>
    </div>
  );
}
