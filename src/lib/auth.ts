import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Get the authentication token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || null;
}

/**
 * Validate token with backend API
 * Returns true if token is valid, false otherwise
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/validate`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    return response.ok;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Middleware helper to check authentication
 * Returns 401 response if not authenticated
 */
export async function requireAuth(): Promise<
  | {
      token: string;
      error?: never;
    }
  | {
      token?: never;
      error: NextResponse;
    }
> {
  const token = await getAuthToken();

  if (!token) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 },
      ),
    };
  }

  return { token };
}

/**
 * Create headers with authentication token
 */
export function createAuthHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
