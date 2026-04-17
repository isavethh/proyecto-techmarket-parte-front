import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/empresa")) {
    const role = request.cookies.get("techmarket_role")?.value;

    if (role !== "empresa_admin") {
      const loginUrl = new URL("/auth?mode=login&type=empresa", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/empresa/:path*"],
};
