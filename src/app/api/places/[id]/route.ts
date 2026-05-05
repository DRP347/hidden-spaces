import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { databaseUnavailableResponse, noStoreHeaders } from "@/lib/apiResponses";
import { createMongoStatus, getMongoStatus } from "@/lib/mongodb";
import { findPlace, toPlace } from "@/lib/placeRepository";
import { sanitizePlacePayload } from "@/lib/placeUtils";
import { PlaceModel } from "@/models/Place";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const place = await findPlace(id);

    if (!place) {
      return NextResponse.json(
        { ok: false, success: false, error: "Place not found." },
        { status: 404, headers: noStoreHeaders },
      );
    }

    return NextResponse.json({ ok: true, success: true, data: place, place }, { headers: noStoreHeaders });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] GET /api/places/[id] failed:", getSafeErrorName(error));
    }

    return NextResponse.json(
      { ok: false, success: false, error: "Unable to load place." },
      { status: 500, headers: noStoreHeaders },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return databaseUnavailableResponse(dbStatus);
  }

  try {
    const { id } = await context.params;
    const payload = sanitizePlacePayload(await request.json());

    const doc = await PlaceModel.findOneAndUpdate(buildIdQuery(id), payload, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return NextResponse.json(
        { ok: false, success: false, error: "Place not found." },
        { status: 404, headers: noStoreHeaders },
      );
    }

    const place = toPlace(doc.toObject());
    return NextResponse.json({ ok: true, success: true, source: "database", data: place, place }, { headers: noStoreHeaders });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] PUT /api/places/[id] failed:", getSafeErrorName(error));
    }

    const failedStatus = createMongoStatus(error, "fallback");
    if (failedStatus.errorType && failedStatus.errorType !== "UNKNOWN") {
      return databaseUnavailableResponse(failedStatus);
    }

    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: error instanceof Error ? error.message : "Unable to update place.",
      },
      { status: 400, headers: noStoreHeaders },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(_request)) {
    return adminUnauthorizedResponse();
  }

  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return databaseUnavailableResponse(dbStatus);
  }

  try {
    const { id } = await context.params;

    const doc = await PlaceModel.findOneAndDelete(buildIdQuery(id));

    if (!doc) {
      return NextResponse.json(
        { ok: false, success: false, error: "Place not found." },
        { status: 404, headers: noStoreHeaders },
      );
    }

    return NextResponse.json({ ok: true, success: true, source: "database", data: { id } }, { headers: noStoreHeaders });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] DELETE /api/places/[id] failed:", getSafeErrorName(error));
    }

    const failedStatus = createMongoStatus(error, "fallback");
    if (failedStatus.errorType && failedStatus.errorType !== "UNKNOWN") {
      return databaseUnavailableResponse(failedStatus);
    }

    return NextResponse.json(
      { ok: false, success: false, error: "Unable to delete place." },
      { status: 500, headers: noStoreHeaders },
    );
  }
}

function buildIdQuery(id: string) {
  if (/^[a-f\d]{24}$/i.test(id)) {
    return { _id: id };
  }

  return { slug: id };
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unknown database error";
  }

  return "name" in error ? String(error.name) : "DatabaseError";
}
