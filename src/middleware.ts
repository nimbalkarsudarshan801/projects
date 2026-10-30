import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const protectedPaths = ["/dashboard", "/student", "/librarian", "/admin", "/superadmin"];
  if (protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/student/:path*", "/librarian/:path*", "/admin/:path*", "/superadmin/:path*"] };
