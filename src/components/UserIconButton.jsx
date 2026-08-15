"use client";

import { User } from "lucide-react";

export default function UserIconButton({ onClick, avatarUrl, displayName, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={avatarUrl ? "Open account menu" : "Sign in"}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/15 bg-white/80 text-brand-ink shadow-sm transition duration-300 hover:border-brand/35 hover:bg-brand-light ${className}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName || "Account"}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-brand/35"
        />
      ) : (
        <User className="h-[18px] w-[18px]" strokeWidth={2.25} />
      )}
    </button>
  );
}
