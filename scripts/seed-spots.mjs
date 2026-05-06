import mongoose, { Schema } from "mongoose";

const DEFAULT_IMAGE_URL = "/images/spots/fallback-field-note.jpg";

const seedSpots = [
  {
    name: "Sutta break",
    slug: "sutta-break",
    category: "Peaceful",
    coordinates: { lat: 20.412363, lng: 72.831551 },
    description: "Want to have a break; come here smoke one nd ghar jao bc.",
    imageSrc:
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777720517/hidden-spaces-daman/places/trog9oaxunzuj51oeiwd.png",
    publicId: "hidden-spaces-daman/places/trog9oaxunzuj51oeiwd",
    gallery: [
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777720517/hidden-spaces-daman/places/trog9oaxunzuj51oeiwd.png",
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777720513/hidden-spaces-daman/places/qzmamtgrxmxijwyewobe.png",
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777720533/hidden-spaces-daman/places/ovimprg6bmye7l1tqqyc.jpg",
    ],
    tags: ["Sutta", "Dhaka"],
    bestTime: "Evening",
    crowdLevel: "Moderate",
    safety: "Stay aware",
    parking: true,
  },
  {
    name: "Dominican Monastery",
    slug: "dominican-monastery",
    category: "Heritage",
    coordinates: { lat: 20.40751, lng: 72.830913 },
    description:
      "A quiet corner near the lighthouse. Ideal for peaceful evenings, private conversations.",
    imageSrc:
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777718473/hidden-spaces-daman/places/xv4gvfs7h0kpqvio0qrv.jpg",
    publicId: "hidden-spaces-daman/places/xv4gvfs7h0kpqvio0qrv",
    gallery: [
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777718473/hidden-spaces-daman/places/xv4gvfs7h0kpqvio0qrv.jpg",
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777718474/hidden-spaces-daman/places/qbaimyt23ifzq2mf2ljx.jpg",
    ],
    tags: ["peaceful", "private", "local"],
    bestTime: "Golden Hour (5:30 PM - 6:45 PM)",
    crowdLevel: "Quiet",
    safety: "Go before dark",
    parking: true,
  },
  {
    name: "Rosario Chapel Bench Spot",
    slug: "rosario-chapel-bench",
    category: "Peaceful",
    coordinates: { lat: 20.406083, lng: 72.834056 },
    description:
      "A quiet bench near the chapel. A slow, peaceful spot to sit and disconnect from the noise.",
    imageSrc:
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777719254/hidden-spaces-daman/places/wsm7mvndqwyezz8yx7wb.png",
    publicId: "hidden-spaces-daman/places/wsm7mvndqwyezz8yx7wb",
    gallery: [
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777719254/hidden-spaces-daman/places/wsm7mvndqwyezz8yx7wb.png",
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777719256/hidden-spaces-daman/places/uk9r0kyel9waoaq7tl2o.png",
    ],
    tags: ["quiet", "bench", "peaceful", "local"],
    bestTime: "Evening",
    crowdLevel: "Quiet",
    safety: "Comfortable",
    parking: false,
  },
  {
    name: "Secret Sunrise Point",
    slug: "secret-sunrise-daman",
    category: "Sunset",
    coordinates: { lat: 20.367846, lng: 72.82418 },
    description: "One of the best sunrise spots in Daman with open horizon and clean light.",
    imageSrc:
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777720814/hidden-spaces-daman/places/cbf4ucidovdliwgkg5vs.png",
    publicId: "hidden-spaces-daman/places/cbf4ucidovdliwgkg5vs",
    gallery: [
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777720814/hidden-spaces-daman/places/cbf4ucidovdliwgkg5vs.png",
    ],
    tags: ["sunrise", "open sky", "photography"],
    bestTime: "Early Morning",
    crowdLevel: "Quiet",
    safety: "Comfortable",
    parking: false,
  },
  {
    name: "Naav Wada Sunrise Spot",
    slug: "naav-wada-sunrise",
    category: "Sunset",
    coordinates: { lat: 20.412672, lng: 72.836214 },
    description:
      "Early morning fishing scene with boats, birds, and soft sunrise light. A raw and authentic local experience.",
    imageSrc:
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777718798/hidden-spaces-daman/places/kwss2xshriid6ujnyxoh.png",
    publicId: "hidden-spaces-daman/places/kwss2xshriid6ujnyxoh",
    gallery: [
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777718798/hidden-spaces-daman/places/kwss2xshriid6ujnyxoh.png",
    ],
    tags: ["sunrise", "boats", "birds", "photography"],
    bestTime: "Early Morning (5:30 AM - 7:00 AM)",
    crowdLevel: "Quiet",
    safety: "Comfortable",
    parking: false,
  },
  {
    name: "Hidden Chill Spot (Moti Daman)",
    slug: "hidden-chill-moti-daman",
    category: "Hidden Lanes",
    coordinates: { lat: 20.409964, lng: 72.835088 },
    description:
      "An underrated local hangout where you can relax with friends away from crowded areas.",
    imageSrc:
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777717694/hidden-spaces-daman/places/obcyqpljio6waxbd04ux.png",
    publicId: "hidden-spaces-daman/places/obcyqpljio6waxbd04ux",
    gallery: [
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777717694/hidden-spaces-daman/places/obcyqpljio6waxbd04ux.png",
      "https://res.cloudinary.com/dmpm2chy6/image/upload/v1777717697/hidden-spaces-daman/places/dxfw9opket02epo6m60d.png",
    ],
    tags: ["hidden", "friends", "chill"],
    bestTime: "Evening",
    crowdLevel: "Quiet",
    safety: "Stay aware",
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
        publicId: spot.publicId || `hidden-spaces-daman/seed/${spot.slug}`,
      },
      gallery: (spot.gallery || []).map((url, index) => ({
        url,
        publicId:
          index === 0 && spot.publicId
            ? spot.publicId
            : `hidden-spaces-daman/seed/${spot.slug}-${index + 1}`,
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
