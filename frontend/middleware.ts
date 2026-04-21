import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("techmarket_role")?.value;

  if (pathname.startsWith("/empresa")) {
    if (role === "empresa_tienda") {
      return NextResponse.next();
    }

    if (role === "empresa_tecnico") {
      return NextResponse.redirect(new URL("/especialista", request.url));
    }

    if (role !== "empresa_tienda" && role !== "empresa_tecnico") {
      const loginUrl = new URL("/auth?mode=login&type=empresa", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/especialista")) {
    if (role === "empresa_tecnico") {
      return NextResponse.next();
    }

    if (role === "empresa_tienda") {
      return NextResponse.redirect(new URL("/empresa/perfil", request.url));
    }

    const loginUrl = new URL("/auth?mode=login&type=empresa", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/embajador")) {
    if (role === "embajador") {
      return NextResponse.next();
    }

    if (role === "empresa_tienda") {
      return NextResponse.redirect(new URL("/empresa", request.url));
    }

    if (role === "empresa_tecnico") {
      return NextResponse.redirect(new URL("/especialista", request.url));
    }

    if (!role) {
      const loginUrl = new URL("/auth?mode=login&type=embajador", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.redirect(new URL("/cliente", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/empresa/:path*", "/especialista/:path*", "/embajador/:path*"],
};
