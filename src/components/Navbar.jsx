"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Menu, PenLine, X } from "lucide-react";
import useDbUser from "@/hooks/useDbUser";
import { useAuthUI } from "@/context/AuthUIContext";
import BrandLogo from "@/components/BrandLogo";
import UserIconButton from "@/components/UserIconButton";

function NavLink({ href, children, onClick, className = "" }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`navbar-nav-link relative text-sm tracking-wide transition duration-300 ${
        isActive ? "is-active font-semibold" : "font-medium"
      } ${className}`}
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
        className={`navbar-solid fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
          scrolled && isHome ? "py-0" : ""
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 transition-all duration-500 sm:px-6 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          <Link
            href="/"
            aria-label="Asli Patta home"
            className="group flex min-w-0 shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            <BrandLogo
              alt=""
              className={`w-auto transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                scrolled ? "h-12 sm:h-14" : "h-14 sm:h-16"
              }`}
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} href={item.to} className="nav-link-active px-1 py-2">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link href="/add">
              <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/35">
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand/15 bg-white/80 text-brand-ink shadow-sm transition duration-300 hover:border-brand/35 hover:bg-brand-light"
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
            className="absolute inset-0 bg-brand-ink/25 backdrop-blur-md"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />

          <div className="absolute inset-x-3 top-[calc(var(--navbar-offset)+0.75rem)] overflow-hidden rounded-2xl border border-brand/12 bg-white shadow-2xl shadow-brand-ink/15">
            <div className="accent-panel border-b border-brand/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand">Menu</p>
              <p className="mt-1 font-display text-lg font-semibold text-brand-ink">Explore Asli Patta</p>
            </div>

            <nav className="grid gap-0.5 p-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 hover:bg-brand-light/70"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="grid gap-2 border-t border-brand/10 p-3">
              <Link href="/add" onClick={() => setOpen(false)}>
                <span className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-sm font-bold text-white shadow-md shadow-brand/25">
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
