import { NextResponse } from "next/server";

import { noStoreHeaders } from "@/lib/apiResponses";
import { getPublicSpots } from "@/lib/publicSpots";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const result = await getPublicSpots();

  return NextResponse.json(
    {
      ok: result.ok,
      source: result.source,
      count: result.count,
      dbStatus: result.dbStatus,
      spots: result.spots,
    },
    {
      headers: noStoreHeaders,
    },
  );
}
