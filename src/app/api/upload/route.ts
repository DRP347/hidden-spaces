import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";

import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminAuth";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const CLOUDINARY_FOLDER = "hidden-spaces-daman/places";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" && !isAdminRequest(request)) {
    return adminUnauthorizedResponse();
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { success: false, error: "Cloudinary environment variables are missing." },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Upload requires an image file." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Image must be 5MB or smaller." },
        { status: 400 },
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = signCloudinaryParams(
      {
        folder: CLOUDINARY_FOLDER,
        timestamp,
      },
      apiSecret,
    );
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("api_key", apiKey);
    cloudinaryData.append("timestamp", timestamp);
    cloudinaryData.append("folder", CLOUDINARY_FOLDER);
    cloudinaryData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryData,
      },
    );
    const payload = (await response.json()) as {
      secure_url?: string;
      public_id?: string;
      error?: { message?: string };
    };

    if (!response.ok || !payload.secure_url || !payload.public_id) {
      return NextResponse.json(
        {
          success: false,
          error: payload.error?.message ?? "Cloudinary upload failed.",
        },
        { status: response.ok ? 502 : response.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        secure_url: payload.secure_url,
        public_id: payload.public_id,
      },
      secure_url: payload.secure_url,
      public_id: payload.public_id,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Hidden Spaces] POST /api/upload failed:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to upload image.",
      },
      { status: 500 },
    );
  }
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const toSign = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${toSign}${apiSecret}`)
    .digest("hex");
}
