import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

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
  { timestamps: true },
);

export type PlaceDocument = InferSchemaType<typeof PlaceSchema>;

export const PlaceModel: Model<PlaceDocument> =
  mongoose.models.Place || mongoose.model<PlaceDocument>("Place", PlaceSchema);
