import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Clear authentication cookie and redirect to login
 */
function clearAuthAndRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  // Clear the auth cookie
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Allow access to login page and public assets
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/image")
  ) {
    return NextResponse.next();
  }

  // Redirect to login if no token and trying to access protected routes
  if (!token && !pathname.startsWith("/login")) {
    return clearAuthAndRedirect(request);
  }

  // Token validation will be handled by API routes individually
  // This prevents excessive validation calls on every page navigation
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
