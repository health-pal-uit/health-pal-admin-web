import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authToken = request.headers
      .get("cookie")
      ?.split("auth_token=")[1]
      ?.split(";")[0];

    if (!authToken) {
      return NextResponse.json(
        { message: "No authentication token found" },
        { status: 401 },
      );
    }

    const baseUrl = process.env.BACKEND_API_URL;

    if (!baseUrl) {
      return NextResponse.json(
        {
          message: "Server configuration error: Missing BACKEND_API_URL",
        },
        { status: 500 },
      );
    }

    const apiRes = await fetch(`${baseUrl}/auth/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await apiRes.json();

    if (!apiRes.ok || data.statusCode !== 200) {
      return NextResponse.json(
        { message: data.message || "Logout failed" },
        { status: data.statusCode || 500 },
      );
    }

    const response = NextResponse.json(
      {
        data: {
          message: data.data?.message || "Logged out successfully",
        },
        message: data.message || "Logout successful",
        statusCode: 200,
      },
      { status: 200 },
    );

    // Clear the auth cookie
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout Proxy Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
