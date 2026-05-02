import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { findPlace, toPlace } from "@/lib/placeRepository";
import { sanitizePlacePayload } from "@/lib/placeUtils";
import { PlaceModel } from "@/models/Place";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const place = await findPlace(id);

    if (!place) {
      return NextResponse.json(
        { success: false, error: "Place not found." },
        { status: 404 },
      );
    } 

    return NextResponse.json({ success: true, data: place, place });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] GET /api/places/[id] failed:", error);
    }

    return NextResponse.json(
      { success: false, error: "Unable to load place." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { success: false, error: "MONGODB_URI is required to update places." },
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;
    const payload = sanitizePlacePayload(await request.json());

    await connectToDatabase();
    const doc = await PlaceModel.findOneAndUpdate(buildIdQuery(id), payload, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Place not found." },
        { status: 404 },
      );
    }

    const place = toPlace(doc.toObject());
    return NextResponse.json({ success: true, data: place, place });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] PUT /api/places/[id] failed:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to update place.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(_request)) {
    return adminUnauthorizedResponse();
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { success: false, error: "MONGODB_URI is required to delete places." },
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;

    await connectToDatabase();
    const doc = await PlaceModel.findOneAndDelete(buildIdQuery(id));

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Place not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] DELETE /api/places/[id] failed:", error);
    }

    return NextResponse.json(
      { success: false, error: "Unable to delete place." },
      { status: 500 },
    );
  }
}

function buildIdQuery(id: string) {
  if (/^[a-f\d]{24}$/i.test(id)) {
    return { _id: id };
  }

  return { slug: id };
}
