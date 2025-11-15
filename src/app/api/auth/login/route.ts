import { NextResponse } from "next/server";

const EXTERNAL_API_URL = "http://localhost:3001/auth/login";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const apiRes = await fetch(EXTERNAL_API_URL, {
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
