import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/empresa")) {
    const role = request.cookies.get("techmarket_role")?.value;
    const isSpecialistPath = pathname.startsWith("/empresa/especialista");

    if (role === "empresa_tienda") {
      if (isSpecialistPath) {
        return NextResponse.redirect(new URL("/empresa/perfil", request.url));
      }
      return NextResponse.next();
    }

    if (role === "empresa_tecnico") {
      if (!isSpecialistPath) {
        return NextResponse.redirect(new URL("/empresa/especialista", request.url));
      }
      return NextResponse.next();
    }

    if (role !== "empresa_tienda" && role !== "empresa_tecnico") {
      const loginUrl = new URL("/auth?mode=login&type=empresa", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/empresa/:path*"],
};
