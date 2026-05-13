import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { databaseUnavailableResponse, noStoreHeaders } from "@/lib/apiResponses";
import { createMongoStatus, getMongoStatus } from "@/lib/mongodb";
import { toPlace } from "@/lib/placeRepository";
import { buildPlacePayloadFromSubmission, serializeSubmission } from "@/lib/submissions";
import { PlaceModel } from "@/models/Place";
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
          message: "This submission has already been converted into a place.",
          submission: serializeSubmission(submission.toObject()),
        },
        { status: 409, headers: noStoreHeaders },
      );
    }

    const body = await request.json();
    const placePayload = await buildPlacePayloadFromSubmission(submission.toObject(), body?.place ?? body);
    const placeDoc = await PlaceModel.create(placePayload);
    const now = new Date();

    submission.status = "approved";
    submission.reviewedAt = now;
    submission.approvedAt = now;
    submission.rejectedAt = undefined;
    submission.convertedPlaceId = placeDoc._id;

    if (typeof body?.adminNotes === "string") {
      submission.adminNotes = body.adminNotes.trim().slice(0, 2000);
    }

    await submission.save();

    return NextResponse.json(
      {
        ok: true,
        success: true,
        source: "database",
        place: toPlace(placeDoc.toObject()),
        submission: serializeSubmission(submission.toObject()),
      },
      { status: 201, headers: noStoreHeaders },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] POST /api/admin/submissions/[id]/approve failed:", getSafeErrorName(error));
    }

    const failedStatus = createMongoStatus(error, "fallback");
    if (failedStatus.errorType && failedStatus.errorType !== "UNKNOWN") {
      return databaseUnavailableResponse(failedStatus);
    }

    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: error instanceof Error ? error.message : "Unable to approve submission.",
      },
      { status: 400, headers: noStoreHeaders },
    );
  }
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") return "Unknown approval error";
  return "name" in error ? String(error.name) : "ApprovalError";
}
