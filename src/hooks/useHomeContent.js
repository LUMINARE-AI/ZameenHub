"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { DEFAULT_HERO_SLIDES } from "@/lib/homeContentDefaults";

function mapHeroSlides(slides) {
  const source = Array.isArray(slides) && slides.length ? slides : DEFAULT_HERO_SLIDES;

  return [0, 1, 2].map((slot) => {
    const match = source.find((item) => Number(item.slot) === slot) || source[slot] || DEFAULT_HERO_SLIDES[slot];
    return {
      slot,
      image: match.url || DEFAULT_HERO_SLIDES[slot].url,
      title: match.title || DEFAULT_HERO_SLIDES[slot].title,
      description: match.description || DEFAULT_HERO_SLIDES[slot].description,
    };
  });
}

function mapTestimonials(items) {
  const source = Array.isArray(items) ? items : [];

  return source.map((item, index) => ({
    _id: item._id || `testimonial-${index}`,
    name: item.name,
    role: item.role,
    quote: item.quote,
    rating: Number(item.rating) || 5,
  }));
}

export default function useHomeContent() {
  const [heroSlides, setHeroSlides] = useState(() => mapHeroSlides(DEFAULT_HERO_SLIDES));
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadContent() {
      setLoading(true);
      setError("");

      try {
        const response = await API.get("/home-content");

        if (!active) {
          return;
        }

        setHeroSlides(mapHeroSlides(response.data?.heroSlides));
        setTestimonials(mapTestimonials(response.data?.testimonials));
      } catch (err) {
        if (active) {
          setHeroSlides(mapHeroSlides(DEFAULT_HERO_SLIDES));
          setTestimonials([]);
          setError(err.response?.data?.message || "Unable to load homepage content.");
        }
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

  return { heroSlides, testimonials, loading, error };
}
