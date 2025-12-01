import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const baseUrl = process.env.BACKEND_API_URL;

    if (!baseUrl) {
      return NextResponse.json(
        {
          message: "Server configuration error: Missing BACKEND_API_URL",
        },
        { status: 500 },
      );
    }

    const apiRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok || data.statusCode !== 200) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: data.statusCode || 401 },
      );
    }

    const token = data.data.token;

    if (!token) {
      return NextResponse.json(
        { message: "Token not found in response" },
        { status: 500 },
      );
    }

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 },
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Proxy Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
