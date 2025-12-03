import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest, _ev: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  // Izinkan akses ke halaman login
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Proteksi semua halaman /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    const isAuth = req.cookies.get("authenticated")?.value === "true";

    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
