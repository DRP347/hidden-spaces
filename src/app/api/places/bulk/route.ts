import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { sanitizePlacePayload } from "@/lib/placeUtils";
import { PlaceModel } from "@/models/Place";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" && !isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { success: false, error: "MONGODB_URI is required to bulk import places." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: "Bulk import expects an array of places." },
        { status: 400 },
      );
    }

    if (body.length === 0) {
      return NextResponse.json(
        { success: false, error: "Bulk import array cannot be empty." },
        { status: 400 },
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

    await connectToDatabase();
    await PlaceModel.insertMany(payloads, { ordered: true });

    return NextResponse.json({
      success: true,
      data: {
        insertedCount: payloads.length,
      },
      insertedCount: payloads.length,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] POST /api/places/bulk failed:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to bulk import places.",
      },
      { status: 400 },
    );
  }
}
