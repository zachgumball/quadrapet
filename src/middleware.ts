import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, secureCookie: process.env.NODE_ENV === "production" });

  console.log("🔍 Middleware Debugging:");
  console.log("Path:", req.nextUrl.pathname);
  console.log("Token:", token ? "✅ Ada Token" : "❌ Tidak Ada Token");

  if (!token) {
    console.log("🚫 Akses Ditolak: Redirect ke /auth-redirect");
    return NextResponse.redirect(new URL("/auth-redirect", req.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/about/:path*", "/gallery/:path*", "/journal/:path*"],
};
