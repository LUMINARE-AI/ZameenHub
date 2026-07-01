"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useDbUser from "@/hooks/useDbUser";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const { user, loading, isSignedIn } = useDbUser();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    if (user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isSignedIn, loading, router, user]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Checking admin access...
      </div>
    );
  }

  return children;
}
