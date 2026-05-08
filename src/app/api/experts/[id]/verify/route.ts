import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const token = request.cookies.get("auth_token")?.value;

    // Get the backend API URL
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/experts/${id}/verify`;

    // Send PATCH request to backend
    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ is_verified: true }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Expert verified successfully",
      data,
    });
  } catch (error) {
    console.error("Error verifying expert:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to verify expert",
      },
      { status: 500 },
    );
  }
}
