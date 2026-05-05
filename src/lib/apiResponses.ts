import { NextResponse } from "next/server";

import type { MongoStatus } from "@/lib/mongodb";

export const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export function databaseUnavailableResponse(dbStatus: MongoStatus) {
  return NextResponse.json(
    {
      ok: false,
      success: false,
      error: "DATABASE_UNAVAILABLE",
      errorType: dbStatus.errorType,
      message:
        "MongoDB is unavailable. Check Atlas Network Access and Vercel Environment Variables.",
      dbStatus,
    },
    {
      status: 503,
      headers: noStoreHeaders,
    },
  );
}
