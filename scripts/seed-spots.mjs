import fs from "node:fs";
import path from "node:path";
import mongoose, { Schema } from "mongoose";

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=900&q=82";

const legacyMockSpots = [
  {
    name: "Nani Daman Jetty Walk",
    slug: "nani-daman-jetty-walk",
    category: "Sunset",
    coordinates: { lat: 20.4171, lng: 72.8328 },
    description: "A quiet river-mouth walk where fishing boats cut through gold light.",
    imageSrc: "/images/spots/nani-daman-jetty-walk.jpg",
    tags: ["golden hour", "river mouth", "slow walk"],
    bestTime: "5:35 PM to 6:45 PM",
    crowdLevel: "Gentle",
    safety: "Comfortable",
    parking: true,
  },
  {
    name: "Moti Daman Fort Walls",
    slug: "moti-daman-fort-walls",
    category: "Heritage",
    coordinates: { lat: 20.4142, lng: 72.8279 },
    description: "Portuguese stone walls, sea breeze, and a slower view of old Daman.",
    imageSrc: "/images/spots/moti-daman-fort-walls.jpg",
    tags: ["fort walls", "Portuguese Daman", "sea view"],
    bestTime: "Early morning or late afternoon",
    crowdLevel: "Gentle",
    safety: "Comfortable",
    parking: true,
  },
  {
    name: "Jampore Beach Quiet Stretch",
    slug: "jampore-beach-quiet-stretch",
    category: "Beaches",
    coordinates: { lat: 20.3681, lng: 72.8278 },
    description: "A wider, calmer side of the beach for morning air and open sand.",
    imageSrc: "/images/spots/jampore-beach-quiet-stretch.jpg",
    tags: ["morning", "open sand", "low crowd"],
    bestTime: "6:15 AM to 8:00 AM",
    crowdLevel: "Quiet",
    safety: "Comfortable",
    parking: false,
  },
  {
    name: "Devka Sea View Corners",
    slug: "devka-sea-view-corners",
    category: "Beaches",
    coordinates: { lat: 20.4425, lng: 72.8344 },
    description: "Small sea-facing pockets where the sound of water carries the scene.",
    imageSrc: "/images/spots/devka-sea-view-corners.jpg",
    tags: ["sea view", "rocks", "evening"],
    bestTime: "After 5:00 PM",
    crowdLevel: "Moderate",
    safety: "Stay aware",
    parking: false,
  },
  {
    name: "Portuguese Lane near Moti Daman",
    slug: "portuguese-lane-near-moti-daman",
    category: "Hidden Lanes",
    coordinates: { lat: 20.4157, lng: 72.8291 },
    description: "Pastel lanes, aged walls, quiet corners, and old-world silence.",
    imageSrc: "",
    tags: ["old lanes", "photo walk", "architecture"],
    bestTime: "9:00 AM or 4:30 PM",
    crowdLevel: "Quiet",
    safety: "Stay aware",
    parking: false,
  },
  {
    name: "Local Food Corner near Jetty",
    slug: "local-food-corner-near-jetty",
    category: "Food",
    coordinates: { lat: 20.4163, lng: 72.8334 },
    description: "A casual local pocket for quick bites after a river-side walk.",
    imageSrc: "/images/spots/local-food-corner-jetty.jpg",
    tags: ["snacks", "street food", "after sunset"],
    bestTime: "Evening snack hour",
    crowdLevel: "Moderate",
    safety: "Stay aware",
    parking: true,
  },
  {
    name: "Sunset Point near Nani Daman",
    slug: "sunset-point-near-nani-daman",
    category: "Sunset",
    coordinates: { lat: 20.4212, lng: 72.834 },
    description: "An easy golden-hour stop when you want sky, water, and little fuss.",
    imageSrc: "/images/spots/sunset-point-nani-daman.jpg",
    tags: ["sunset", "easy access", "waterfront"],
    bestTime: "Golden hour",
    crowdLevel: "Gentle",
    safety: "Comfortable",
    parking: true,
  },
  {
    name: "Peaceful Café Stop",
    slug: "peaceful-cafe-stop",
    category: "Cafés",
    coordinates: { lat: 20.4172, lng: 72.8295 },
    description: "A calm coffee pause between fort walks and old-lane wandering.",
    imageSrc: "/images/spots/peaceful-cafe-stop.jpg",
    tags: ["coffee", "quiet stop", "between walks"],
    bestTime: "Late afternoon",
    crowdLevel: "Quiet",
    safety: "Comfortable",
    parking: true,
  },
  {
    name: "Old Chapel Walk",
    slug: "old-chapel-walk",
    category: "Heritage",
    coordinates: { lat: 20.416, lng: 72.8287 },
    description: "A quiet chapel-side walk with muted colors and soft old-town detail.",
    imageSrc: "/images/spots/old-chapel-walk.jpg",
    tags: ["chapel", "heritage", "quiet street"],
    bestTime: "Morning after 8:00 AM",
    crowdLevel: "Quiet",
    safety: "Comfortable",
    parking: false,
  },
  {
    name: "Hidden Morning Beach Patch",
    slug: "hidden-morning-beach-patch",
    category: "Photo Spots",
    coordinates: { lat: 20.3822, lng: 72.8234 },
    description: "Open sky, textured foregrounds, and soft light for quiet portraits.",
    imageSrc: "/images/spots/hidden-morning-beach-patch.jpg",
    tags: ["sunrise", "portraits", "open sky"],
    bestTime: "Sunrise to 7:30 AM",
    crowdLevel: "Quiet",
    safety: "Comfortable",
    parking: false,
  },
  {
    name: "Daman Lighthouse View",
    slug: "daman-lighthouse-view",
    category: "Photo Spots",
    coordinates: { lat: 20.4148, lng: 72.8264 },
    description: "A clean coastal frame where the lighthouse anchors the old fort edge.",
    imageSrc: "/images/spots/daman-lighthouse-view.jpg",
    tags: ["lighthouse", "heritage", "photo walk"],
    bestTime: "Early morning or golden hour",
    crowdLevel: "Gentle",
    safety: "Comfortable",
    parking: false,
  },
];

const CloudinaryImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const PlaceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      default: "Peaceful",
      enum: [
        "Sunset",
        "Peaceful",
        "Cafés",
        "Photo Spots",
        "Beaches",
        "Heritage",
        "Food",
        "Hidden Lanes",
      ],
      index: true,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    description: { type: String, required: true, trim: true },
    images: {
      cover: { type: CloudinaryImageSchema, required: true },
      gallery: { type: [CloudinaryImageSchema], default: [] },
    },
    tags: { type: [String], default: [] },
    bestTime: { type: String, default: "" },
    crowdLevel: {
      type: String,
      enum: ["Quiet", "Gentle", "Moderate", "Busy at peaks"],
      default: "Gentle",
    },
    safety: {
      type: String,
      enum: [
        "Comfortable",
        "Stay aware",
        "Go before dark",
        "Local guidance suggested",
      ],
      default: "Comfortable",
    },
    parking: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, collection: "places" },
);

const PlaceModel =
  mongoose.models.Place || mongoose.model("Place", PlaceSchema, "places");

loadLocalEnvFiles();

function loadLocalEnvFiles() {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = path.join(process.cwd(), fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const contents = fs.readFileSync(filePath, "utf8");

    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const equalsIndex = trimmed.indexOf("=");

      if (equalsIndex < 1) {
        continue;
      }

      const key = trimmed.slice(0, equalsIndex).trim();

      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || process.env[key]) {
        continue;
      }

      process.env[key] = unquoteEnvValue(trimmed.slice(equalsIndex + 1).trim());
    }
  }
}

function unquoteEnvValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function getMongoUri() {
  return (
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    ""
  ).trim();
}

function toPlacePayload(spot) {
  const coverUrl = spot.imageSrc || DEFAULT_IMAGE_URL;
  const galleryUrls = spot.gallery?.length ? spot.gallery : [coverUrl];

  return {
    name: spot.name,
    slug: spot.slug,
    category: spot.category,
    coordinates: spot.coordinates,
    description: spot.description,
    images: {
      cover: {
        url: coverUrl,
        publicId: `hidden-spaces-daman/legacy/${spot.slug}/cover`,
      },
      gallery: galleryUrls.map((url, index) => ({
        url,
        publicId: `hidden-spaces-daman/legacy/${spot.slug}/gallery-${index + 1}`,
      })),
    },
    tags: spot.tags,
    bestTime: spot.bestTime,
    crowdLevel: spot.crowdLevel || "Gentle",
    safety: spot.safety || "Comfortable",
    parking: Boolean(spot.parking),
    isPublished: true,
  };
}

async function main() {
  const uri = getMongoUri();

  if (!uri) {
    console.error("Missing MONGODB_URI. Add it to .env.local or your shell environment before seeding.");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    bufferCommands: false,
    family: 4,
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 15000,
    tls: true,
  });

  let inserted = 0;
  let updated = 0;

  for (const spot of legacyMockSpots) {
    const result = await PlaceModel.updateOne(
      { slug: spot.slug },
      { $set: toPlacePayload(spot) },
      { upsert: true, runValidators: true },
    );

    if (result.upsertedCount > 0) {
      inserted += 1;
    } else {
      updated += 1;
    }
  }

  console.log(
    `Seed complete. Inserted ${inserted}, updated ${updated}, total ${legacyMockSpots.length}.`,
  );
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(
    error instanceof Error
      ? `Seed failed: ${error.name}`
      : "Seed failed: Unknown error",
  );

  try {
    await mongoose.disconnect();
  } finally {
    process.exit(1);
  }
});
