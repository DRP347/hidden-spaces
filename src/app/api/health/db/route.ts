import { NextResponse } from "next/server";

import { noStoreHeaders } from "@/lib/apiResponses";
import { getMongoStatus } from "@/lib/mongodb";
import { PlaceModel } from "@/models/Place";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const status = await getMongoStatus("database");

  return NextResponse.json(
    {
      ok: status.connected,
      configured: status.configured,
      connected: status.connected,
      errorType: status.errorType,
      message: status.message,
      env: process.env.NODE_ENV === "production" ? "production" : "development",
      source: status.connected ? "database" : "fallback",
      model: "Place",
      collection: PlaceModel.collection.name,
    },
    {
      status: status.connected ? 200 : 503,
      headers: noStoreHeaders,
    },
  );
}
