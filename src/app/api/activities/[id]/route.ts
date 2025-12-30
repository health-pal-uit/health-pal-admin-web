import { NextRequest } from "next/server";
import {
  withAuth,
  fetchBackend,
  handleBackendResponse,
} from "@/src/lib/api-auth";

export const PATCH = withAuth(
  async (request: NextRequest, { token, params }) => {
    const { id } = await params;
    const body = await request.json();

    const response = await fetchBackend(`/activities/${id}`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    return handleBackendResponse(response, "Failed to update activity");
  },
);

export const DELETE = withAuth(
  async (_request: NextRequest, { token, params }) => {
    const { id } = await params;

    const response = await fetchBackend(`/activities/${id}`, token, {
      method: "DELETE",
    });

    return handleBackendResponse(response, "Failed to delete activity");
  },
);
