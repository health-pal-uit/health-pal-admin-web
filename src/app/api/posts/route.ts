import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Post } from "../../(main)/community/type";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let allPosts: Post[] = [];
    let page = 1;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/posts?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken.value}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || "Failed to fetch posts" },
          { status: response.status },
        );
      }

      if (data.data && data.data.length > 0) {
        allPosts = [...allPosts, ...data.data];
        page++;
        hasMore = data.data.length === limit;
      } else {
        hasMore = false;
      }
    }

    return NextResponse.json({
      data: allPosts,
      message: "Success",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
