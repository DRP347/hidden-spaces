import { fallbackSpots } from "@/data/spots";
import {
  createMongoStatus,
  getMongoStatus,
  resetDatabaseConnection,
  type MongoStatus,
} from "@/lib/mongodb";
import { toPlace } from "@/lib/placeRepository";
import { normalizeSpot, placesToSpots } from "@/lib/spotAdapter";
import { PlaceModel } from "@/models/Place";
import type { Spot } from "@/types/spot";

export type PublicDataNotice = {
  tone: "info" | "warning";
  title: string;
  message: string;
};

export type PublicSpotSource = "database" | "database-empty" | "fallback";

export type PublicSpotsResult = {
  ok: boolean;
  source: PublicSpotSource;
  count: number;
  dbStatus: MongoStatus;
  spots: Spot[];
  notice: PublicDataNotice | null;
};

export async function getPublicSpots(): Promise<PublicSpotsResult> {
  const database = await getDatabaseSpots();

  if (database.dbStatus.connected && database.spots.length > 0) {
    return {
      ok: true,
      source: "database",
      count: database.spots.length,
      dbStatus: {
        ...database.dbStatus,
        source: "database",
      },
      spots: database.spots,
      notice: null,
    };
  }

  const fallbackSpots = getFallbackSpots();

  if (database.dbStatus.connected) {
    return {
      ok: true,
      source: "database-empty",
      count: 0,
      dbStatus: {
        ...database.dbStatus,
        source: "database",
      },
      spots: [],
      notice: {
        tone: "info",
        title: "MongoDB is connected but has no public field notes.",
        message:
          "No fallback data is being mixed in. Add public places in admin to publish the map.",
      },
    };
  }

  return {
    ok: true,
    source: "fallback",
    count: fallbackSpots.length,
    dbStatus: {
      ...database.dbStatus,
      source: "fallback",
    },
    spots: fallbackSpots,
    notice: {
      tone: "warning",
      title: "Using curated fallback field notes.",
      message: database.dbStatus.message,
    },
  };
}

export async function getDatabaseSpots() {
  const dbStatus = await getMongoStatus("database");

  if (!dbStatus.connected) {
    return {
      dbStatus,
      spots: [] as Spot[],
    };
  }

  try {
    const docs = await PlaceModel.find({ isPublished: { $ne: false } })
      .sort({ updatedAt: -1, name: 1 })
      .lean();
    const spots = placesToSpots(docs.map(toPlace)).map(normalizeSpot);

    return {
      dbStatus,
      spots,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[Hidden Spaces] MongoDB getDatabaseSpots failed:",
        getSafeErrorName(error),
      );
    }

    await resetDatabaseConnection();

    return {
      dbStatus: createMongoStatus(error, "fallback"),
      spots: [] as Spot[],
    };
  }
}

export function getFallbackSpots() {
  return fallbackSpots.map(normalizeSpot);
}

function getSafeErrorName(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unknown database error";
  }

  return "name" in error ? String(error.name) : "DatabaseError";
}
