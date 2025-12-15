import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const url = `${process.env.BACKEND_API_URL}/meals`;

    const apiRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to create meal" },
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
