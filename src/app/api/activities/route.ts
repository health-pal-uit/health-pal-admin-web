import { NextRequest } from "next/server";
import {
  withAuth,
  fetchBackend,
  handleBackendResponse,
} from "@/src/lib/api-auth";

export const GET = withAuth(async (request: NextRequest, { token }) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  const response = await fetchBackend(
    `/activities?page=${page}&limit=${limit}`,
    token,
    { method: "GET" },
  );

  return handleBackendResponse(response, "Failed to fetch activities");
});

export const POST = withAuth(async (request: NextRequest, { token }) => {
  const body = await request.json();

  const response = await fetchBackend("/activities", token, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return handleBackendResponse(response, "Failed to create activity");
});
