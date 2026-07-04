"use client";

import { AuthUIProvider } from "@/context/AuthUIContext";

export default function AppProviders({ children }) {
  return <AuthUIProvider>{children}</AuthUIProvider>;
}
