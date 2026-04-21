import { useEffect, useMemo, useState } from "react";
import { mockProperties } from "../data/mockProperties";
import API from "../services/api";
import { normalizeProperty } from "../utils/property";

export default function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      setLoading(true);

      try {
        const response = await API.get("/properties");
        const remoteProperties = Array.isArray(response.data) ? response.data : [];
        const normalizedRemote = remoteProperties.map(normalizeProperty);

        if (active) {
          const merged = [...normalizedRemote];

          mockProperties.forEach((property, index) => {
            if (!merged.some((item) => item._id === property._id)) {
              merged.push(normalizeProperty(property, index));
            }
          });

          setProperties(merged);
        }
      } catch {
        if (active) {
          setProperties(mockProperties.map(normalizeProperty));
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
    () => properties.filter((property) => property.featured).slice(0, 5),
    [properties]
  );

  return { properties, featuredProperties, loading };
}
