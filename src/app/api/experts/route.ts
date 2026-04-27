import { NextRequest, NextResponse } from "next/server";
import { ApiExpert, Expert } from "@/src/app/(main)/experts/type";

function transformApiExpert(apiExpert: ApiExpert): Expert {
  return {
    id: apiExpert.id,
    name: apiExpert.user.fullname || apiExpert.user.username,
    email: apiExpert.user.email,
    phone: apiExpert.user.phone,
    avatar: apiExpert.user.avatar_url,
    specialization: apiExpert.expert_role.name,
    bio: apiExpert.bio,
    status: apiExpert.is_verified ? "verified" : "pending",
    application_date: apiExpert.created_at,
    licenseUrl: apiExpert.license_url,
    licenseId: apiExpert.license_id,
    rating: {
      avg: apiExpert.rating_avg,
      count: apiExpert.rating_count,
    },
    isVerified: apiExpert.is_verified,
    canDoVideo: apiExpert.expert_role.can_do_video,
    created_at: apiExpert.created_at,
    tokenPerMinute: apiExpert.token_per_minute,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const token = request.cookies.get("auth_token")?.value;

    const backendUrl = new URL(`${process.env.BACKEND_API_URL}/experts`);

    if (search) {
      backendUrl.searchParams.append("search", search);
    }

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    const experts = Array.isArray(data.data) ? data.data : data;

    let transformed = (experts as ApiExpert[]).map(transformApiExpert);

    if (status === "verified") {
      transformed = transformed.filter((e) => e.status === "verified");
    } else if (status === "pending") {
      transformed = transformed.filter((e) => e.status === "pending");
    }

    if (search) {
      transformed = transformed.filter(
        (expert) =>
          expert.name.toLowerCase().includes(search.toLowerCase()) ||
          expert.email.toLowerCase().includes(search.toLowerCase()) ||
          expert.specialization.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return NextResponse.json({
      success: true,
      data: transformed,
      total: transformed.length,
    });
  } catch (error) {
    console.error("Error fetching experts:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch experts",
      },
      { status: 500 },
    );
  }
}
