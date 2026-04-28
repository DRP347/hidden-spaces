import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!password && process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");

  if (authorization) {
    const [scheme, encoded] = authorization.split(" ");

    if (scheme === "Basic" && encoded) {
      try {
        const credentials = atob(encoded);
        const separatorIndex = credentials.indexOf(":");
        const submittedPassword = credentials.slice(separatorIndex + 1);

        if (separatorIndex >= 0 && submittedPassword === password) {
          return NextResponse.next();
        }
      } catch {
        return unauthorized();
      }
    }
  }

  return unauthorized();
}

function unauthorized() {
  return new NextResponse("Admin authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Hidden Spaces Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
