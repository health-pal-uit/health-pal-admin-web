import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const metric = searchParams.get("metric") || "overview";
  const segment = searchParams.get("segment") || "day";
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { message: "start_date and end_date are required" },
      { status: 400 },
    );
  }

  const url = `${process.env.BACKEND_API_URL}/admin-reports?metric=${metric}&segment=${segment}&start_date=${startDate}&end_date=${endDate}`;

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
        { message: data.message || "Failed to fetch reports" },
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
