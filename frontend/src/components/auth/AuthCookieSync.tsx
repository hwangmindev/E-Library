"use client";

import { useEffect } from "react";
import { ensureAuthCookieFromStorage } from "@/lib/api/auth";

/** Aligns the auth cookie with `localStorage` on load so middleware matches the navbar session. */
export default function AuthCookieSync() {
  useEffect(() => {
    ensureAuthCookieFromStorage();
  }, []);

  return null;
}
