import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { databaseUnavailableResponse, noStoreHeaders } from "@/lib/apiResponses";
import { getMongoStatus } from "@/lib/mongodb";
import { serializeSubmission } from "@/lib/submissions";
import { SpotSubmissionModel } from "@/models/SpotSubmission";
import type { SubmissionStatus } from "@/types/submissionTypes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return databaseUnavailableResponse(dbStatus);
  }

  try {
    const { id } = await context.params;
    const doc = await SpotSubmissionModel.findById(id).lean();

    if (!doc) {
      return NextResponse.json(
        { ok: false, success: false, error: "Submission not found." },
        { status: 404, headers: noStoreHeaders },
      );
    }

    return NextResponse.json(
      { ok: true, success: true, submission: serializeSubmission(doc), dbStatus },
      { headers: noStoreHeaders },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] GET /api/admin/submissions/[id] failed:", getSafeErrorName(error));
    }

    return NextResponse.json(
      { ok: false, success: false, error: "Unable to load submission." },
      { status: 500, headers: noStoreHeaders },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return databaseUnavailableResponse(dbStatus);
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      status?: SubmissionStatus;
      adminNotes?: string;
    };
    const updates: Record<string, unknown> = {};

    if (body.status === "pending" || body.status === "approved" || body.status === "rejected") {
      updates.status = body.status;
      updates.reviewedAt = new Date();
    }

    if (typeof body.adminNotes === "string") {
      updates.adminNotes = body.adminNotes.trim().slice(0, 2000);
    }

    const doc = await SpotSubmissionModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doc) {
      return NextResponse.json(
        { ok: false, success: false, error: "Submission not found." },
        { status: 404, headers: noStoreHeaders },
      );
    }

    return NextResponse.json(
      { ok: true, success: true, submission: serializeSubmission(doc), dbStatus },
      { headers: noStoreHeaders },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] PATCH /api/admin/submissions/[id] failed:", getSafeErrorName(error));
    }

    return NextResponse.json(
      { ok: false, success: false, error: "Unable to update submission." },
      { status: 400, headers: noStoreHeaders },
    );
  }
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") return "Unknown submission error";
  return "name" in error ? String(error.name) : "SubmissionError";
}
