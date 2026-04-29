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
    { label: "Home", to: "/" },
    { label: "Buy", to: "/buy-plots" },
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
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-xl sm:px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-extrabold text-white">
            ZH
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-900">ZameenHub</p>
            <p className="hidden text-[11px] text-slate-500 sm:block">Real Estate Marketplace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-bold transition ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session.loggedIn ? (
            <>
              <span className="max-w-28 truncate text-xs font-semibold text-slate-500">
                {session.user?.name || "Signed in"}
              </span>
              <Button variant="ghost" className="px-3 py-2 text-xs" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="px-3 py-2 text-xs">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" className="px-3 py-2 text-xs">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <Link to="/buy-plots">
            <Button variant="dark" className="px-3 py-2 text-xs">
              Explore
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900 md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 rounded bg-current transition ${
                open ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 rounded bg-current transition ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 rounded bg-current transition ${
                open ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-2 max-w-[1440px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-xl md:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {session.loggedIn ? (
                <Button variant="ghost" className="col-span-2 w-full" onClick={handleLogout}>
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
              <Link to="/buy-plots" onClick={() => setOpen(false)} className="col-span-2 w-full">
                <Button variant="dark" className="w-full">Explore Plots</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
