import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  clearSession,
  getStoredUser,
  isLoggedIn,
  subscribeToSessionChanges,
} from "../utils/auth";
import Button from "./ui/Button";

const buyerItems = [
  { label: "Plots", to: "/buy-plots" },
  { label: "Commercial Land", to: "/listings?category=Commercial+Land" },
  { label: "Agricultural Land", to: "/listings?category=Agricultural+Land" },
  { label: "Flats", to: "/listings?category=Flats" },
  { label: "Shops", to: "/listings?category=Shops" },
];

const tenantItems = [
  { label: "Shops", to: "/listings?category=Shops" },
  { label: "PG", to: "/listings?category=PG" },
  { label: "Flat / Home", to: "/listings?category=Flats+%2F+Homes" },
];

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
            <p className="text-base font-semibold text-slate-950">ZameenHub</p>
            <p className="text-xs text-slate-500">Real Estate Marketplace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-slate-950 underline underline-offset-4 decoration-2 decoration-blue-600"
                  : "text-slate-500 hover:text-slate-900"
              }`
            }
          >
            Home
          </NavLink>

          <div className="group relative">
            <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950">
              For Buyers <span className="text-blue-500">▾</span>
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-30 mt-3 hidden min-w-[220px] rounded-[28px] border border-slate-200 bg-white p-3 shadow-xl transition duration-200 group-hover:block group-hover:pointer-events-auto">
              {buyerItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative">
            <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950">
              For Tenants <span className="text-blue-500">▾</span>
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-30 mt-3 hidden min-w-[220px] rounded-[28px] border border-slate-200 bg-white p-3 shadow-xl transition duration-200 group-hover:block group-hover:pointer-events-auto">
              {tenantItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <NavLink
            to="/add"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-slate-950 underline underline-offset-4 decoration-2 decoration-blue-600"
                  : "text-slate-500 hover:text-slate-900"
              }`
            }
          >
            Sell Property
          </NavLink>

          {session.loggedIn && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-slate-950 underline underline-offset-4 decoration-2 decoration-blue-600"
                    : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}

          {session.user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-slate-950 underline underline-offset-4 decoration-2 decoration-blue-600"
                    : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session.loggedIn ? (
            <>
              <span className="text-sm text-slate-500">{session.user?.name || "Signed in"}</span>
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
          <Link to="/buy-plots">
            <Button variant="primary" className="px-4 py-2.5">
              Explore Plots
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
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">For Buyers</p>
              <div className="mt-3 space-y-2">
                {buyerItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">For Tenants</p>
              <div className="mt-3 space-y-2">
                {tenantItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/add"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Sell Property
            </Link>
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
            <Link to="/buy-plots" onClick={() => setOpen(false)} className="w-full">
              <Button className="w-full">Explore Plots</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
