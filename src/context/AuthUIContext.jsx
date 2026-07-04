"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import AuthModal from "@/components/AuthModal";
import AccountMenu from "@/components/AccountMenu";

const AuthUIContext = createContext(null);

export function AuthUIProvider({ children }) {
  const { isSignedIn } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("sign-in");
  const [accountOpen, setAccountOpen] = useState(false);

  const closeAll = useCallback(() => {
    setAuthOpen(false);
    setAccountOpen(false);
  }, []);

  const openAuth = useCallback((tab = "sign-in") => {
    setAccountOpen(false);
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  const openAccount = useCallback(() => {
    setAuthOpen(false);
    setAccountOpen(true);
  }, []);

  const handleUserIconClick = useCallback(() => {
    if (isSignedIn) {
      openAccount();
    } else {
      openAuth("sign-in");
    }
  }, [isSignedIn, openAccount, openAuth]);

  useEffect(() => {
    if (isSignedIn) {
      setAuthOpen(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    const overflow = authOpen || accountOpen ? "hidden" : "";
    document.body.style.overflow = overflow;
    return () => {
      document.body.style.overflow = "";
    };
  }, [authOpen, accountOpen]);

  return (
    <AuthUIContext.Provider value={{ openAuth, openAccount, handleUserIconClick, closeAll }}>
      {children}
      <AuthModal
        open={authOpen}
        tab={authTab}
        onTabChange={setAuthTab}
        onClose={() => setAuthOpen(false)}
      />
      <AccountMenu open={accountOpen} onClose={() => setAccountOpen(false)} />
    </AuthUIContext.Provider>
  );
}

export function useAuthUI() {
  const context = useContext(AuthUIContext);

  if (!context) {
    throw new Error("useAuthUI must be used within AuthUIProvider");
  }

  return context;
}
