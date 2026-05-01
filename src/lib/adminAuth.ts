import { NextResponse, type NextRequest } from "next/server";

export function isAdminRequest(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return false;
  }

  const [scheme, encoded] = authorization.split(" ");

  if (scheme !== "Basic" || !encoded) {
    return false;
  }

  try {
    const credentials = Buffer.from(encoded, "base64").toString("utf8");
    const separatorIndex = credentials.indexOf(":");

    if (separatorIndex < 0) {
      return false;
    }

    return credentials.slice(separatorIndex + 1) === password;
  } catch {
    return false;
  }
}

export function adminUnauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Admin authentication required." },
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Hidden Spaces Admin"',
      },
    },
  );
}
