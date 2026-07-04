"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { LayoutGrid, Menu, PenLine, X } from "lucide-react";
import useDbUser from "@/hooks/useDbUser";
import { useAuthUI } from "@/context/AuthUIContext";
import UserIconButton from "@/components/UserIconButton";

function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`navbar-nav-link nav-link-active relative rounded-lg px-3.5 py-2 text-sm font-semibold tracking-wide !text-white transition duration-300 ${
        isActive ? "is-active font-bold" : "text-white/90 hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { user } = useDbUser();
  const { handleUserIconClick } = useAuthUI();

  const isHome = pathname === "/";
  const isHeroHeader = isHome && !scrolled;

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Listings", to: "/listings" },
    { label: "Contact", to: "/contact" },
    ...(isSignedIn ? [{ label: "Dashboard", to: "/dashboard" }] : []),
    ...(user?.role === "admin" ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
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

  const avatarUrl = isSignedIn ? clerkUser?.imageUrl : null;
  const displayName = user?.name || clerkUser?.firstName || "Account";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
          isHeroHeader ? "navbar-hero" : "navbar-solid"
        } ${scrolled && isHome ? "py-0" : ""}`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 transition-all duration-500 sm:px-6 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <div className="relative flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/15 ring-1 ring-brand-accent/40 transition duration-300 group-hover:bg-brand-accent/25 group-hover:ring-brand-accent/60">
                <LayoutGrid className="h-5 w-5 text-brand-accent" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 leading-none">
                <span className="font-display block truncate text-[15px] font-bold tracking-[0.14em] text-white sm:text-base">
                  ZAMEENHUB
                </span>
                <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent sm:block">
                  Premium Realty
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/5 px-1.5 py-1 text-white backdrop-blur-sm lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} href={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link href="/add">
              <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition duration-300 hover:-translate-y-0.5 hover:bg-brand-accent-dark hover:shadow-xl hover:shadow-brand-accent/35">
                <PenLine className="h-4 w-4" strokeWidth={2.5} />
                Add Property
              </span>
            </Link>

            <UserIconButton
              onClick={handleUserIconClick}
              avatarUrl={avatarUrl}
              displayName={displayName}
            />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <UserIconButton
              onClick={handleUserIconClick}
              avatarUrl={avatarUrl}
              displayName={displayName}
            />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 hover:border-brand-accent/50 hover:bg-white/20"
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
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />

          <div className="absolute inset-x-3 top-[calc(var(--navbar-offset)+0.75rem)] overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-brand-dark to-brand shadow-2xl shadow-brand-dark/40">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-accent">Menu</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">Explore ZameenHub</p>
            </div>

            <nav className="grid gap-0.5 p-3 text-white">
              {navItems.map((item) => (
                <NavLink key={item.label} href={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="grid gap-2 border-t border-white/10 p-3">
              <Link href="/add" onClick={() => setOpen(false)}>
                <span className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-accent text-sm font-bold text-brand-dark shadow-md shadow-brand-accent/25">
                  <PenLine className="h-4 w-4" strokeWidth={2.5} />
                  Add Property
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
