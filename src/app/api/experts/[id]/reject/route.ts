import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { success: false, error: "Rejection reason is required" },
        { status: 400 },
      );
    }

    // TODO: Replace with actual database update
    // await db.experts.update(id, {
    //   status: 'rejected',
    //   rejection_reason: reason
    // });

    return NextResponse.json({
      success: true,
      message: "Expert rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting expert:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reject expert" },
      { status: 500 },
    );
  }
}
