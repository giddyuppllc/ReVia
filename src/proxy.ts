import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

async function verifyEdgeToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Case-normalize: Google indexed mixed-case paths like `/Locations/Providence`
  // that 404 against our all-lowercase routes. Permanently redirect any path
  // containing uppercase to its lowercase form (entity IDs are cuid() =
  // lowercase, so this never mangles a real /checkout/pay/<id> etc.).
  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    const url = request.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 308);
  }

  // Protect /account routes
  if (pathname.startsWith("/account")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyEdgeToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyEdgeToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Broadened from just /account + /admin so the case-normalizer also runs on
  // public page routes. Skips _next internals, api routes, and any path with a
  // file extension (static assets, which can be legitimately mixed-case). The
  // auth guards above stay scoped via their startsWith checks.
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
