import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API Route Handler type with authentication
 */
export type AuthenticatedHandler = (
  request: NextRequest,
  context: { token: string; params?: Promise<Record<string, string>> },
) => Promise<NextResponse>;

/**
 * Wrapper for API routes that require authentication
 * Automatically checks for token and returns 401 if missing
 * Validates token with backend and clears cookie if invalid
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (
    request: NextRequest,
    context?: { params?: Promise<Record<string, string>> },
  ) => {
    try {
      // Get token from cookies
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token")?.value;

      // Return 401 if no token
      if (!token) {
        return NextResponse.json(
          { message: "Unauthorized - No authentication token" },
          { status: 401 },
        );
      }

      // Call the handler with token
      return await handler(request, { token, params: context?.params });
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

/**
 * Make authenticated request to backend API
 * Automatically includes authorization header
 */
export async function fetchBackend(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${process.env.BACKEND_API_URL}${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

/**
 * Handle backend API response
 * Returns NextResponse with appropriate status and data
 * If 401, clears auth cookie to trigger logout
 */
export async function handleBackendResponse(
  response: Response,
  errorMessage = "Request failed",
): Promise<NextResponse> {
  try {
    const data = await response.json();

    if (!response.ok) {
      const statusCode = data.statusCode || response.status;
      const nextResponse = NextResponse.json(
        { message: data.message || errorMessage },
        { status: statusCode },
      );

      // If unauthorized (401), clear auth cookie to trigger auto-logout
      if (statusCode === 401) {
        nextResponse.cookies.set("auth_token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 0,
          path: "/",
        });
      }

      return nextResponse;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error parsing backend response:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
