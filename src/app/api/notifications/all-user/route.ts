import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.message) {
      return NextResponse.json(
        { message: "Title and message are required" },
        { status: 400 },
      );
    }

    const url = `${process.env.BACKEND_API_URL}/notifications/all-user`;

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
        { message: data.message || "Failed to send notification" },
        { status: data.statusCode || 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
