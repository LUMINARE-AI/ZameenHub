"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { LayoutGrid, LogIn, Menu, PenLine, X } from "lucide-react";
import useDbUser from "@/hooks/useDbUser";

function NavLink({ href, children, onClick, overlay }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`nav-link-active relative rounded-md px-3 py-2 text-sm font-semibold transition ${
        overlay
          ? isActive
            ? "is-active text-brand-accent"
            : "text-white/90 hover:text-white"
          : isActive
            ? "is-active text-brand"
            : "text-slate-700 hover:text-brand-ink"
      }`}
    >
      {children}
    </Link>
  );
}

const logoClass =
  "flex items-center gap-2 rounded-xl bg-brand px-2.5 py-2 shadow-md shadow-brand/20";
const ctaClass =
  "inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-bold text-brand-dark shadow-md shadow-brand-accent/20 transition duration-200 hover:scale-[1.03] hover:bg-brand-accent-dark hover:shadow-lg";
const authClass =
  "inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white transition duration-200 hover:bg-brand-dark";
const menuClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white transition duration-200 hover:bg-brand-dark";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { user } = useDbUser();

  const isHome = pathname === "/";

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Listings", to: "/listings" },
    { label: "Contact", to: "/contact" },
    ...(isSignedIn ? [{ label: "Dashboard", to: "/dashboard" }] : []),
    ...(user?.role === "admin" ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overlayNav = isHome && !scrolled;
  const avatarUrl = clerkUser?.imageUrl;
  const displayName = user?.name || clerkUser?.firstName || "Signed in";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          overlayNav
            ? "navbar-hero"
            : "border-b border-slate-200/80 bg-white/92 shadow-sm backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
            <div className={logoClass}>
              <LayoutGrid className="h-5 w-5 shrink-0 text-white" strokeWidth={2.5} />
              <span className="font-display truncate text-sm font-extrabold tracking-wide text-white sm:text-[15px]">
                ZAMEENHUB
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} href={item.to} overlay={overlayNav}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/add">
              <span className={ctaClass}>
                <PenLine className="h-4 w-4" strokeWidth={2.5} />
                Add a Property
              </span>
            </Link>

            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition ${
                    overlayNav ? "hover:bg-white/10" : "hover:bg-brand-light"
                  }`}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-accent/50"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-brand-dark">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span
                    className={`max-w-24 truncate text-xs font-semibold ${
                      overlayNav ? "text-white/80" : "text-brand-muted"
                    }`}
                  >
                    {displayName}
                  </span>
                </Link>
                <SignOutButton>
                  <button type="button" className={authClass}>
                    <LogIn className="h-4 w-4" strokeWidth={2.5} />
                    Logout
                  </button>
                </SignOutButton>
              </>
            ) : (
              <Link href="/sign-in">
                <span className={authClass}>
                  <LogIn className="h-4 w-4" strokeWidth={2.5} />
                  Sign In
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {isSignedIn ? (
              <SignOutButton>
                <button type="button" className={`${authClass} px-3.5`}>
                  <LogIn className="h-4 w-4" strokeWidth={2.5} />
                  Logout
                </button>
              </SignOutButton>
            ) : (
              <Link href="/sign-in">
                <span className={`${authClass} px-3.5`}>
                  <LogIn className="h-4 w-4" strokeWidth={2.5} />
                  Login
                </span>
              </Link>
            )}

            <button
              type="button"
              className={menuClass}
              onClick={() => setOpen((current) => !current)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" strokeWidth={2.5} /> : <Menu className="h-5 w-5" strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute inset-x-3 top-[4.5rem] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <nav className="grid gap-1">
              {navItems.map((item) => (
                <NavLink key={item.label} href={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4">
              <Link href="/add" onClick={() => setOpen(false)}>
                <span className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-accent text-sm font-bold text-brand-dark">
                  <PenLine className="h-4 w-4" strokeWidth={2.5} />
                  Add a Property
                </span>
              </Link>

              {!isSignedIn ? (
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  <span className="flex min-h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
                    Sign Up
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
