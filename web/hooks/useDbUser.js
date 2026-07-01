"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import API from "@/lib/api";

export default function useDbUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await API.get("/me");

        if (active) {
          setUser(response.data);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn]);

  return { user, loading, isSignedIn: Boolean(isSignedIn) };
}
