"use client";

import { Suspense } from "react";
import ListingsPage from "@/components/pages/ListingsPage";

function ListingsFallback() {
  return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading listings...</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<ListingsFallback />}>
      <ListingsPage />
    </Suspense>
  );
}
