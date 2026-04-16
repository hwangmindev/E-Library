import API from "./axios";
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_ACCOUNT_STORAGE_KEY,
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE_SECONDS,
} from "../constants/auth";
import { RegisterPayload, LoginPayload } from "../types/auth";
import { findUserById } from "./user";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.slice(name.length + 1));
    }
  }
  return null;
}

function writeAuthCookie(accessToken: string) {
  const enc = encodeURIComponent(accessToken);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${enc}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function clearAuthCookieClient() {
  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0`;
}

/** If a token exists in `localStorage` but not in the auth cookie, set the cookie (e.g. older sessions). */
export function ensureAuthCookieFromStorage() {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!token) return;
  const existing = getCookie(AUTH_TOKEN_COOKIE_NAME);
  if (!existing) writeAuthCookie(token);
}

export const register = async (data: RegisterPayload) => {
  await API.post("auth/register", data);
};

export const login = async (data: LoginPayload) => {
  const res = await API.post("auth/login", data);

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, res.data.access_token);
    const user = await findUserById(res.data.userId);
    localStorage.setItem(AUTH_ACCOUNT_STORAGE_KEY, JSON.stringify(user));
  }
  return res.data;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_ACCOUNT_STORAGE_KEY);
    clearAuthCookieClient();
  }
};
