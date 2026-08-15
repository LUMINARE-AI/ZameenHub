"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import StatusBanner from "@/components/StatusBanner";

export default function AdminHeroSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ tone: "info", message: "" });
  const [busySlot, setBusySlot] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const response = await API.get("/home-content");
        if (!active) return;
        setSlides(Array.isArray(response.data?.heroSlides) ? response.data.heroSlides : []);
      } catch (error) {
        if (!active) return;
        setStatus({
          tone: "error",
          message: error.response?.data?.message || "Unable to load hero images.",
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

  async function replaceSlide(slot, file) {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("slot", String(slot));
    formData.append("image", file);

    try {
      setBusySlot(slot);
      const response = await API.put("/admin/home-content/hero", formData);
      setSlides(Array.isArray(response.data?.heroSlides) ? response.data.heroSlides : []);
      setStatus({ tone: "success", message: `Hero image ${slot + 1} updated.` });
    } catch (error) {
      setStatus({
        tone: "error",
        message: error.response?.data?.message || "Hero image upload failed.",
      });
    } finally {
      setBusySlot(null);
    }
  }

  return (
    <div className="space-y-4">
      <StatusBanner tone={status.tone} message={status.message} />
      <p className="text-sm text-brand-muted">
        Exactly 3 hero slots. Upload a new image to replace a slot. Bundled defaults stay until
        replaced.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-3xl bg-white" />
            ))
          : [0, 1, 2].map((slot) => {
              const slide = slides.find((item) => Number(item.slot) === slot) || slides[slot];
              return (
                <div
                  key={slot}
                  className="overflow-hidden rounded-3xl border border-brand/10 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] bg-brand-mist">
                    {slide?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={slide.url}
                        alt={`Hero slot ${slot + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                    <span className="absolute left-3 top-3 rounded-full bg-brand-ink/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      Slot {slot + 1}
                    </span>
                  </div>
                  <div className="space-y-3 p-4">
                    <p className="truncate text-sm text-brand-muted">{slide?.url || "No image"}</p>
                    <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark">
                      {busySlot === slot ? "Uploading…" : "Replace image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={busySlot === slot}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          void replaceSlide(slot, file);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
