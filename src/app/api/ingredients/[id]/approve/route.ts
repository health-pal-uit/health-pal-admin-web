import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get("auth_token")?.value;
  const { id } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = `${process.env.BACKEND_API_URL}/contribution-ingres/${id}/approve`;

  try {
    const apiRes = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to approve ingredient" },
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
