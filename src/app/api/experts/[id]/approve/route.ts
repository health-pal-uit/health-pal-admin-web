import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // TODO: Replace with actual database update
    // await db.experts.update(id, { status: 'approved' });

    return NextResponse.json({
      success: true,
      message: "Expert approved successfully",
    });
  } catch (error) {
    console.error("Error approving expert:", error);
    return NextResponse.json(
      { success: false, error: "Failed to approve expert" },
      { status: 500 },
    );
  }
}
