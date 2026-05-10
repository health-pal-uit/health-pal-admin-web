import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("auth_token")?.value;

    // Get the backend API URL
    const baseUrl = process.env.BACKEND_API_URL || "http://localhost:3000";
    const backendUrl = `${baseUrl}/experts/${id}/verify`;

    // Send PATCH request to backend
    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ is_verified: true }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = JSON.parse(rawText);

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
