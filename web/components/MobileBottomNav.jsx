"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Home, LayoutGrid, PenLine, User } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Listings", href: "/listings", icon: LayoutGrid },
  { label: "Add", href: "/add", icon: PenLine },
  { label: "Account", href: "/dashboard", icon: User, auth: true },
  { label: "Login", href: "/sign-in", icon: User, guest: true },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const items = navItems.filter((item) => {
    if (item.auth) return isSignedIn;
    if (item.guest) return !isSignedIn;
    return true;
  });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-brand/10 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,92,72,0.08)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition ${
                isActive ? "text-brand" : "text-brand-muted hover:text-brand-dark"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.label}</span>
              {isActive ? (
                <span className="h-0.5 w-4 rounded-full bg-brand-accent" />
              ) : (
                <span className="h-0.5 w-4" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
