import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { databaseUnavailableResponse, noStoreHeaders } from "@/lib/apiResponses";
import { getMongoStatus } from "@/lib/mongodb";
import { serializeSubmission } from "@/lib/submissions";
import { SpotSubmissionModel } from "@/models/SpotSubmission";
import type { SubmissionStatus } from "@/types/submissionTypes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const statuses: SubmissionStatus[] = ["pending", "approved", "rejected"];

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return databaseUnavailableResponse(dbStatus);
  }

  const statusParam = request.nextUrl.searchParams.get("status") ?? "pending";
  const query = statuses.includes(statusParam as SubmissionStatus)
    ? { status: statusParam }
    : {};

  try {
    const docs = await SpotSubmissionModel.find(query).sort({ createdAt: -1 }).lean();
    const submissions = docs.map(serializeSubmission);
    const counts = await SpotSubmissionModel.aggregate<{ _id: SubmissionStatus; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusCounts = Object.fromEntries(counts.map((item) => [item._id, item.count]));
    const allCount = counts.reduce((total, item) => total + item.count, 0);

    return NextResponse.json(
      {
        ok: true,
        success: true,
        dbStatus,
        submissions,
        counts: {
          all: allCount,
          pending: 0,
          approved: 0,
          rejected: 0,
          ...statusCounts,
        },
      },
      { headers: noStoreHeaders },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] GET /api/admin/submissions failed:", getSafeErrorName(error));
    }

    return NextResponse.json(
      { ok: false, success: false, error: "Unable to load submissions." },
      { status: 500, headers: noStoreHeaders },
    );
  }
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") return "Unknown submission error";
  return "name" in error ? String(error.name) : "SubmissionError";
}
