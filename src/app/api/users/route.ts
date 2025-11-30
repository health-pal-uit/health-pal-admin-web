import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const EXTERNAL_API_URL = "http://localhost:3001/users";

export async function GET(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  const url = `${EXTERNAL_API_URL}?page=${page}&limit=${limit}`;

  try {
    const apiRes = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch users" },
        { status: data.statusCode || 500 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
