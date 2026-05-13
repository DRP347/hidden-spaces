import type { PlaceCategory } from "@/types/placeTypes";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type SpotSubmission = {
  id: string;
  name: string;
  area: string;
  category: PlaceCategory;
  reason: string;
  description: string;
  bestTime: string;
  mapsLink: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  submitterName: string;
  submitterContact: string;
  notes: string;
  status: SubmissionStatus;
  adminNotes: string;
  reviewedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  convertedPlaceId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};
