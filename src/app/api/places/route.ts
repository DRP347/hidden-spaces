import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { listPlaces, toPlace } from "@/lib/placeRepository";
import { sanitizePlacePayload } from "@/lib/placeUtils";
import { PlaceModel } from "@/models/Place";

export async function GET(request: NextRequest) {
  try {
    const includePrivate = request.nextUrl.searchParams.get("admin") === "1";

    if (includePrivate && !isAdminRequest(request)) {
      return adminUnauthorizedResponse();
    }

    const result = await listPlaces({ includePrivate });

    return NextResponse.json({
      success: true,
      source: result.source,
      mongoConfigured: result.mongoConfigured,
      fallbackReason: result.fallbackReason ?? null,
      data: result.places,
      places: result.places,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] GET /api/places failed:", error);
    }

    return NextResponse.json(
      { success: false, error: "Unable to load places." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { success: false, error: "MONGODB_URI is required to create places." },
      { status: 503 },
    );
  }

  try {
    const payload = sanitizePlacePayload(await request.json());

    await connectToDatabase();
    const doc = await PlaceModel.create(payload);
    const place = toPlace(doc.toObject());

    return NextResponse.json(
      { success: true, data: place, place },
      { status: 201 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] POST /api/places failed:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to create place.",
      },
      { status: 400 },
    );
  }
}
