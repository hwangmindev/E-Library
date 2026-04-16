import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE_NAME } from "./lib/constants/auth";

const PUBLIC_ROUTE = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTE.includes(pathname);

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
