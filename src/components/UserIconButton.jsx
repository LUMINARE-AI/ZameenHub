"use client";

import { User } from "lucide-react";

export default function UserIconButton({ onClick, avatarUrl, displayName, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={avatarUrl ? "Open account menu" : "Sign in"}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 hover:border-brand-accent/50 hover:bg-white/20 ${className}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName || "Account"}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-accent/60"
        />
      ) : (
        <User className="h-[18px] w-[18px]" strokeWidth={2.25} />
      )}
    </button>
  );
}
