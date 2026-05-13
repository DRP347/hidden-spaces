import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { databaseUnavailableResponse, noStoreHeaders } from "@/lib/apiResponses";
import { getMongoStatus } from "@/lib/mongodb";
import { serializeSubmission } from "@/lib/submissions";
import { SpotSubmissionModel } from "@/models/SpotSubmission";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return databaseUnavailableResponse(dbStatus);
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { adminNotes?: string };
    const submission = await SpotSubmissionModel.findById(id);

    if (!submission) {
      return NextResponse.json(
        { ok: false, success: false, error: "Submission not found." },
        { status: 404, headers: noStoreHeaders },
      );
    }

    if (submission.convertedPlaceId) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error: "ALREADY_CONVERTED",
          message: "This submission has already been converted into a place and cannot be rejected.",
          submission: serializeSubmission(submission.toObject()),
        },
        { status: 409, headers: noStoreHeaders },
      );
    }

    const now = new Date();
    submission.status = "rejected";
    submission.rejectedAt = now;
    submission.reviewedAt = now;
    submission.adminNotes = typeof body.adminNotes === "string" ? body.adminNotes.trim().slice(0, 2000) : "";

    await submission.save();

    return NextResponse.json(
      { ok: true, success: true, source: "database", submission: serializeSubmission(submission.toObject()) },
      { headers: noStoreHeaders },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] POST /api/admin/submissions/[id]/reject failed:", getSafeErrorName(error));
    }

    return NextResponse.json(
      { ok: false, success: false, error: "Unable to reject submission." },
      { status: 400, headers: noStoreHeaders },
    );
  }
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") return "Unknown rejection error";
  return "name" in error ? String(error.name) : "RejectionError";
}
