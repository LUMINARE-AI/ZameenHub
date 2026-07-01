"use client";

import { useEffect, useMemo, useState } from "react";
import API from "@/lib/api";
import { normalizeProperty } from "@/lib/property";

export default function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProperties() {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/properties");
      const remoteProperties = Array.isArray(response.data) ? response.data : [];
      setProperties(remoteProperties.map(normalizeProperty));
    } catch (err) {
      setProperties([]);
      setError(err.response?.data?.message || "Unable to load property listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      setLoading(true);
      setError("");

      try {
        const response = await API.get("/properties");

        if (active) {
          const remoteProperties = Array.isArray(response.data) ? response.data : [];
          setProperties(remoteProperties.map(normalizeProperty));
        }
      } catch (err) {
        if (active) {
          setProperties([]);
          setError(err.response?.data?.message || "Unable to load property listings.");
        }
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

  const featuredProperties = useMemo(
    () => properties.filter((property) => property.featured),
    [properties]
  );

  return { properties, featuredProperties, loading, error, refetch: fetchProperties };
}
