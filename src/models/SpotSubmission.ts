import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SubmissionCoordinatesSchema = new Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false },
);

const SpotSubmissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    area: { type: String, required: true, trim: true, maxlength: 120 },
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
    },
    reason: { type: String, required: true, trim: true, maxlength: 1200 },
    description: { type: String, default: "", trim: true, maxlength: 1200 },
    bestTime: { type: String, default: "", trim: true, maxlength: 160 },
    mapsLink: { type: String, default: "", trim: true, maxlength: 500 },
    coordinates: { type: SubmissionCoordinatesSchema, default: undefined },
    submitterName: { type: String, default: "", trim: true, maxlength: 120 },
    submitterContact: { type: String, default: "", trim: true, maxlength: 180 },
    notes: { type: String, default: "", trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    adminNotes: { type: String, default: "", trim: true, maxlength: 2000 },
    reviewedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    convertedPlaceId: { type: Schema.Types.ObjectId, ref: "Place" },
  },
  { timestamps: true, collection: "spot_submissions" },
);

export type SpotSubmissionDocument = InferSchemaType<typeof SpotSubmissionSchema>;

export const SpotSubmissionModel: Model<SpotSubmissionDocument> =
  mongoose.models.SpotSubmission ||
  mongoose.model<SpotSubmissionDocument>("SpotSubmission", SpotSubmissionSchema);
