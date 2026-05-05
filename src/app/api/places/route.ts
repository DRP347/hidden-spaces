import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { databaseUnavailableResponse, noStoreHeaders } from "@/lib/apiResponses";
import { createMongoStatus, getMongoStatus } from "@/lib/mongodb";
import { listPlaces, toPlace } from "@/lib/placeRepository";
import { sanitizePlacePayload } from "@/lib/placeUtils";
import { PlaceModel } from "@/models/Place";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const includePrivate = request.nextUrl.searchParams.get("admin") === "1";

    if (includePrivate && !isAdminRequest(request)) {
      return adminUnauthorizedResponse();
    }

    const result = await listPlaces({ includePrivate });

    return NextResponse.json({
      ok: true,
      success: true,
      source: result.source,
      mongoConfigured: result.mongoConfigured,
      fallbackReason: result.fallbackReason ?? null,
      dbStatus: result.dbStatus,
      count: result.places.length,
      data: result.places,
      places: result.places,
    }, { headers: noStoreHeaders });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] GET /api/places failed:", getSafeErrorName(error));
    }

    return NextResponse.json(
      { ok: false, success: false, error: "Unable to load places." },
      { status: 500, headers: noStoreHeaders },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return databaseUnavailableResponse(dbStatus);
  }

  try {
    const payload = sanitizePlacePayload(await request.json());

    const doc = await PlaceModel.create(payload);
    const place = toPlace(doc.toObject());

    return NextResponse.json(
      { ok: true, success: true, source: "database", data: place, place },
      { status: 201, headers: noStoreHeaders },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] POST /api/places failed:", getSafeErrorName(error));
    }

    const failedStatus = createMongoStatus(error, "fallback");
    if (failedStatus.errorType && failedStatus.errorType !== "UNKNOWN") {
      return databaseUnavailableResponse(failedStatus);
    }

    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: error instanceof Error ? error.message : "Unable to create place.",
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
