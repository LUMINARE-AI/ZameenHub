import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  clearSession,
  getStoredUser,
  isLoggedIn,
  subscribeToSessionChanges,
} from "../utils/auth";
import Button from "./ui/Button";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState({
    loggedIn: isLoggedIn(),
    user: getStoredUser(),
  });

  useEffect(
    () =>
      subscribeToSessionChanges(() => {
        setSession({
          loggedIn: isLoggedIn(),
          user: getStoredUser(),
        });
      }),
    []
  );

  const navItems = [
    { label: "Buy", to: "/" },
    { label: "Sell", to: "/add" },
    ...(session.loggedIn ? [{ label: "Dashboard", to: "/dashboard" }] : []),
    ...(session.user?.role === "admin" ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  function handleLogout() {
    clearSession();
    setOpen(false);
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between rounded-[28px] border border-white/70 bg-white/80 px-5 py-3 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
            ZH
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">ZameenHub</p>
            <p className="text-xs text-slate-500">Find premium spaces</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session.loggedIn ? (
            <>
              <span className="text-sm text-slate-500">
                {session.user?.name || "Signed in"}
              </span>
              <Button variant="ghost" className="px-4 py-2.5" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="px-4 py-2.5">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" className="px-4 py-2.5">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <Link to="/listings">
            <Button variant="primary" className="px-4 py-2.5">
              Explore Listings
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle menu"
        >
          <span className="text-lg">{open ? "x" : "☰"}</span>
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-3 max-w-[1440px] rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </NavLink>
            ))}
            {session.loggedIn ? (
              <Button variant="ghost" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="w-full">
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="w-full">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
            <Link to="/listings" onClick={() => setOpen(false)} className="w-full">
              <Button className="w-full">Explore Listings</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
