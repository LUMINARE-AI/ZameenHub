"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, LogOut, PenLine, Shield, X } from "lucide-react";
import useDbUser from "@/hooks/useDbUser";

export default function AccountMenu({ open, onClose }) {
  const { user: clerkUser } = useUser();
  const { user } = useDbUser();

  if (!open) {
    return null;
  }

  const displayName = user?.name || clerkUser?.fullName || clerkUser?.firstName || "Account";
  const email = clerkUser?.primaryEmailAddress?.emailAddress || user?.email || "";
  const avatarUrl = clerkUser?.imageUrl;
  const isAdmin = user?.role === "admin";

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Add Property", href: "/add", icon: PenLine },
    ...(isAdmin ? [{ label: "Admin Panel", href: "/admin", icon: Shield }] : []),
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close account menu"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-menu-title"
        className="relative z-10 w-full rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:max-w-sm sm:rounded-3xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-brand/30"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-sm font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p id="account-menu-title" className="truncate font-display text-lg font-bold text-brand-ink">
                {displayName}
              </p>
              {email ? <p className="truncate text-sm text-brand-muted">{email}</p> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-muted transition hover:bg-brand/10 hover:text-brand"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <nav className="grid gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-light"
              >
                <Icon className="h-4 w-4 text-brand" strokeWidth={2.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <SignOutButton>
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" strokeWidth={2.5} />
              Log out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
