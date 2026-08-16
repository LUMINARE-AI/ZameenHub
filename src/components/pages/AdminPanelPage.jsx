"use client";

import { useState } from "react";
import AdminPendingSection from "@/components/admin/AdminPendingSection";
import AdminHeroSection from "@/components/admin/AdminHeroSection";
import AdminFeaturedSection from "@/components/admin/AdminFeaturedSection";
import AdminTestimonialsSection from "@/components/admin/AdminTestimonialsSection";
import AdminFooterSection from "@/components/admin/AdminFooterSection";
import AdminUsersSection from "@/components/admin/AdminUsersSection";

const tabs = [
  { id: "pending", label: "Approvals" },
  { id: "hero", label: "Hero images" },
  { id: "featured", label: "Featured" },
  { id: "testimonials", label: "Testimonials" },
  { id: "footer", label: "Footer" },
  { id: "users", label: "Users" },
];

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-brand/10 bg-white/90 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-brand">Admin panel</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-brand-ink">
          Content &amp; marketplace controls
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Manage hero images, featured listings, testimonials, footer contact links, user roles, and
          pending property approvals from one place.
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "bg-white text-brand-muted ring-1 ring-brand/10 hover:bg-brand-light hover:text-brand-dark"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <section className="rounded-3xl border border-brand/10 bg-brand-mist/40 p-4 sm:p-6">
        {activeTab === "pending" ? <AdminPendingSection /> : null}
        {activeTab === "hero" ? <AdminHeroSection /> : null}
        {activeTab === "featured" ? <AdminFeaturedSection /> : null}
        {activeTab === "testimonials" ? <AdminTestimonialsSection /> : null}
        {activeTab === "footer" ? <AdminFooterSection /> : null}
        {activeTab === "users" ? <AdminUsersSection /> : null}
      </section>
    </div>
  );
}
