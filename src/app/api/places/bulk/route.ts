import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { databaseUnavailableResponse, noStoreHeaders } from "@/lib/apiResponses";
import { createMongoStatus, getMongoStatus } from "@/lib/mongodb";
import { sanitizePlacePayload } from "@/lib/placeUtils";
import { PlaceModel } from "@/models/Place";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" && !isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return databaseUnavailableResponse(dbStatus);
  }

  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { ok: false, success: false, error: "Bulk import expects an array of places." },
        { status: 400, headers: noStoreHeaders },
      );
    }

    if (body.length === 0) {
      return NextResponse.json(
        { ok: false, success: false, error: "Bulk import array cannot be empty." },
        { status: 400, headers: noStoreHeaders },
      );
    }

    const payloads = body.map((entry, index) => {
      try {
        return sanitizePlacePayload(entry);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Invalid place payload.";

        throw new Error(`Entry ${index + 1}: ${message}`);
      }
    });

    await PlaceModel.insertMany(payloads, { ordered: true });

    return NextResponse.json({
      ok: true,
      success: true,
      source: "database",
      data: {
        insertedCount: payloads.length,
      },
      insertedCount: payloads.length,
    }, { headers: noStoreHeaders });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] POST /api/places/bulk failed:", getSafeErrorName(error));
    }

    const failedStatus = createMongoStatus(error, "fallback");
    if (failedStatus.errorType && failedStatus.errorType !== "UNKNOWN") {
      return databaseUnavailableResponse(failedStatus);
    }

    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: error instanceof Error ? error.message : "Unable to bulk import places.",
      },
      { status: 400, headers: noStoreHeaders },
    );
  }
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unknown database error";
  }

  return "name" in error ? String(error.name) : "DatabaseError";
}
