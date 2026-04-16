export const AUTH_TOKEN_STORAGE_KEY = "token";
export const AUTH_ACCOUNT_STORAGE_KEY = "account";

/**
 * Cookie name mirroring the access token so `middleware` can gate routes.
 * Must be kept in sync with login / logout cookie writes.
 */
export const AUTH_TOKEN_COOKIE_NAME = "token";

/** Matches backend `SIMPLE_JWT.ACCESS_TOKEN_LIFETIME` (1 day). */
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;
