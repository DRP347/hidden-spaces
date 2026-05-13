import { NextResponse, type NextRequest } from "next/server";

import { noStoreHeaders } from "@/lib/apiResponses";
import { getMongoStatus } from "@/lib/mongodb";
import { parseCoordinatePair } from "@/lib/placeUtils";
import { SpotSubmissionModel } from "@/models/SpotSubmission";
import { spotCategories, type SpotCategory } from "@/types/spot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SubmissionPayload = {
  name?: unknown;
  area?: unknown;
  category?: unknown;
  reason?: unknown;
  description?: unknown;
  bestTime?: unknown;
  mapsLink?: unknown;
  coordinates?: unknown;
  submitterName?: unknown;
  submitterContact?: unknown;
  notes?: unknown;
};

export async function POST(request: NextRequest) {
  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "SUBMISSIONS_UNAVAILABLE",
        errorType: dbStatus.errorType,
        message: "Spot submissions are unavailable right now. Please try again later.",
      },
      { status: 503, headers: noStoreHeaders },
    );
  }

  let payload: SubmissionPayload;

  try {
    payload = await request.json();
  } catch {
    return validationResponse("Invalid JSON payload.");
  }

  const submission = sanitizeSubmission(payload);
  const validationError = validateSubmission(submission);

  if (validationError) {
    return validationResponse(validationError);
  }

  try {
    const doc = await SpotSubmissionModel.create({
      ...submission,
      status: "pending",
    });

    return NextResponse.json(
      {
        ok: true,
        success: true,
        id: doc._id.toString(),
        status: "pending",
        message: "Thanks. I’ll review it before adding it to the map.",
      },
      { status: 201, headers: noStoreHeaders },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] POST /api/submissions failed:", getSafeErrorName(error));
    }

    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "SUBMISSION_FAILED",
        message: "Unable to save the spot right now. Please try again later.",
      },
      { status: 500, headers: noStoreHeaders },
    );
  }
}

function sanitizeSubmission(payload: SubmissionPayload) {
  const mapsLink = clean(payload.mapsLink, 500);
  const parsedCoordinates =
    parseCoordinatePair(payload.coordinates) ?? parseCoordinatePair(mapsLink);

  return {
    name: clean(payload.name),
    area: clean(payload.area),
    category: normalizeCategory(payload.category),
    reason: clean(payload.reason, 1200),
    description: clean(payload.description, 1200),
    bestTime: clean(payload.bestTime, 160),
    mapsLink,
    coordinates: parsedCoordinates ?? undefined,
    submitterName: clean(payload.submitterName),
    submitterContact: clean(payload.submitterContact, 180),
    notes: clean(payload.notes, 1000),
  };
}

function validateSubmission(submission: ReturnType<typeof sanitizeSubmission>) {
  if (!submission.name) return "Spot name is required.";
  if (!submission.area) return "Area or neighbourhood is required.";
  if (!submission.reason) return "Tell us why this spot is worth visiting.";
  return null;
}

function clean(value: unknown, maxLength = 120) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeCategory(value: unknown): SpotCategory {
  return spotCategories.includes(value as SpotCategory) ? (value as SpotCategory) : "Peaceful";
}

function validationResponse(message: string) {
  return NextResponse.json(
    {
      ok: false,
      success: false,
      error: "VALIDATION_ERROR",
      message,
    },
    { status: 400, headers: noStoreHeaders },
  );
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unknown submission error";
  }

  return "name" in error ? String(error.name) : "SubmissionError";
}
