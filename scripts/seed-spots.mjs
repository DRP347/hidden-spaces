import mongoose, { Schema } from "mongoose";

const DEFAULT_IMAGE_URL = "/images/spots/fallback-field-note.jpg";

const seedSpots = [
  {
    name: "Nani Daman River Walk",
    slug: "nani-daman-river-walk",
    category: "Sunset",
    coordinates: { lat: 20.4171, lng: 72.8328 },
    description: "A calm river-mouth walk for golden light, boats, and an easy pause.",
    imageSrc: "/images/spots/nani-daman-jetty-walk.jpg",
    tags: ["golden hour", "river mouth", "slow walk"],
    bestTime: "5:35 PM to 6:45 PM",
  },
  {
    name: "Moti Daman Heritage Loop",
    slug: "moti-daman-heritage-loop",
    category: "Heritage",
    coordinates: { lat: 20.4142, lng: 72.8279 },
    description: "Fort walls, chapel lanes, old stone, and a slower view of Daman.",
    imageSrc: "/images/spots/moti-daman-fort-walls.jpg",
    tags: ["fort walls", "old Daman", "photo walk"],
    bestTime: "Early morning or late afternoon",
  },
  {
    name: "Jampore Morning Beach",
    slug: "jampore-morning-beach",
    category: "Beaches",
    coordinates: { lat: 20.3681, lng: 72.8278 },
    description: "A wider beach stretch for low-crowd walks and open morning air.",
    imageSrc: "/images/spots/jampore-beach-quiet-stretch.jpg",
    tags: ["morning", "open sand", "low crowd"],
    bestTime: "6:15 AM to 8:00 AM",
  },
  {
    name: "Devka Sea View Pause",
    slug: "devka-sea-view-pause",
    category: "Beaches",
    coordinates: { lat: 20.4425, lng: 72.8344 },
    description: "Small sea-facing pockets where the rocks and water hold evening light.",
    imageSrc: "/images/spots/devka-sea-view-corners.jpg",
    tags: ["sea view", "rocks", "evening"],
    bestTime: "After 5:00 PM",
  },
  {
    name: "Quiet Old Lane Walk",
    slug: "quiet-old-lane-walk",
    category: "Peaceful",
    coordinates: { lat: 20.4157, lng: 72.8291 },
    description: "A soft old-town walk for quiet corners, aged walls, and small details.",
    imageSrc: "",
    tags: ["old lanes", "quiet walk", "architecture"],
    bestTime: "9:00 AM or 4:30 PM",
  },
  {
    name: "Local Food Stop near Jetty",
    slug: "local-food-stop-near-jetty",
    category: "Food",
    coordinates: { lat: 20.4163, lng: 72.8334 },
    description: "A simple local pocket for quick bites after a river-side walk.",
    imageSrc: "/images/spots/local-food-corner-jetty.jpg",
    tags: ["snacks", "street food", "after sunset"],
    bestTime: "Evening snack hour",
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

  return {
    name: spot.name,
    slug: spot.slug,
    category: spot.category,
    coordinates: spot.coordinates,
    description: spot.description,
    images: {
      cover: {
        url: coverUrl,
        publicId: `hidden-spaces-daman/seed/${spot.slug}`,
      },
      gallery: [],
    },
    tags: spot.tags,
    bestTime: spot.bestTime,
    crowdLevel: "Gentle",
    safety: "Comfortable",
    parking: false,
    isPublished: true,
  };
}

async function main() {
  const uri = getMongoUri();

  if (!uri) {
    console.error("Missing MONGODB_URI. Add it to your environment before seeding.");
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

  for (const spot of seedSpots) {
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

  console.log(`Seed complete. Inserted ${inserted}, updated ${updated}.`);
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
