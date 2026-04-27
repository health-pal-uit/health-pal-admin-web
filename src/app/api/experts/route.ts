import { NextRequest, NextResponse } from "next/server";

// Mock data for testing - replace with actual database calls
const mockExperts = [
  {
    id: 1,
    name: "Dr. Nguyen Van A",
    email: "nguyenvana@email.com",
    specialization: "Nutrition Science",
    experience_years: 8,
    certificates_count: 2,
    status: "pending",
    application_date: "2026-04-01",
    bio: "Leading nutrition expert with 8 years of experience in health and nutrition field.",
    qualifications: [
      "PhD in Nutrition Science - National University",
      "ISSN Specialist Certificate",
    ],
  },
  {
    id: 2,
    name: "Ms. Tran Thi B",
    email: "tranthib@email.com",
    specialization: "Clinical Nutrition",
    experience_years: 5,
    certificates_count: 2,
    status: "pending",
    application_date: "2026-04-02",
    bio: "Clinical Nutrition specialist with experience working at major hospitals.",
    qualifications: [
      "Master of Clinical Nutrition",
      "Registered Dietitian (RD) Certificate",
    ],
  },
  {
    id: 3,
    name: "Vu Thi F",
    email: "vuthif@email.com",
    specialization: "Plant-Based Nutrition",
    experience_years: 6,
    certificates_count: 2,
    status: "pending",
    application_date: "2026-04-03",
    bio: "Plant-based nutrition specialist who has consulted thousands of clients.",
    qualifications: ["Nutrition Diploma", "Plant-Based Nutrition Certificate"],
  },
  {
    id: 4,
    name: "Dr. Le Van C",
    email: "levanc@email.com",
    specialization: "Sports Nutrition",
    experience_years: 10,
    certificates_count: 3,
    status: "approved",
    application_date: "2026-03-15",
    reviewed_at: "2026-03-20",
    bio: "PhD in Sports Nutrition who has guided many professional athletes.",
    qualifications: ["PhD in Nutrition", "CISSN Certificate"],
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") as
      | "pending"
      | "approved"
      | "rejected"
      | null;

    let filtered = mockExperts;

    if (search) {
      filtered = filtered.filter(
        (expert) =>
          expert.name.toLowerCase().includes(search.toLowerCase()) ||
          expert.email.toLowerCase().includes(search.toLowerCase()) ||
          expert.specialization.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (status) {
      filtered = filtered.filter((expert) => expert.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Error fetching experts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch experts" },
      { status: 500 },
    );
  }
}
