"use client";

import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";
import { AUTH_TOKEN_STORAGE_KEY } from "@/lib/constants/auth";

function readLoggedIn() {
  return !!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function useAuthSession() {
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const loggedIn = readLoggedIn();
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  useLayoutEffect(() => {
    refresh();
  }, [pathname, refresh]);

  useLayoutEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_STORAGE_KEY || e.key === null) {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  return {
    isLoggedIn: !!isLoggedIn,
    isLoading,
    refresh,
  };
}
