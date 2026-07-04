"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { X } from "lucide-react";

const clerkAppearance = {
  elements: {
    rootBox: "w-full",
    card: "shadow-none p-0 gap-4",
    headerTitle: "text-brand-ink font-display",
    headerSubtitle: "text-brand-muted",
    formButtonPrimary:
      "bg-brand hover:bg-brand-dark text-white text-sm font-bold normal-case",
    footerActionLink: "text-brand hover:text-brand-dark font-semibold",
    formFieldInput:
      "rounded-xl border-slate-200 focus:border-brand focus:ring-brand/15",
    socialButtonsBlockButton: "rounded-xl border-slate-200",
  },
};

export default function AuthModal({ open, tab, onTabChange, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close sign in"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p id="auth-modal-title" className="font-display text-xl font-bold text-brand-ink">
              {tab === "sign-in" ? "Welcome back" : "Create account"}
            </p>
            <p className="mt-1 text-sm text-brand-muted">
              {tab === "sign-in"
                ? "Sign in to manage your listings"
                : "Join ZameenHub to post and track properties"}
            </p>
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

        <div className="mb-5 flex rounded-xl bg-brand-light/60 p-1 ring-1 ring-brand/10">
          <button
            type="button"
            onClick={() => onTabChange("sign-in")}
            className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
              tab === "sign-in"
                ? "bg-white text-brand shadow-sm"
                : "text-brand-muted hover:text-brand-dark"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => onTabChange("sign-up")}
            className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
              tab === "sign-up"
                ? "bg-white text-brand shadow-sm"
                : "text-brand-muted hover:text-brand-dark"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="flex justify-center">
          {tab === "sign-in" ? (
            <SignIn routing="hash" signUpUrl="#sign-up" appearance={clerkAppearance} />
          ) : (
            <SignUp routing="hash" signInUrl="#sign-in" appearance={clerkAppearance} />
          )}
        </div>
      </div>
    </div>
  );
}
