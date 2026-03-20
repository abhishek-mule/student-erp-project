import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl;

  const subdomain = hostname.split(".")[0];
  const isSuperAdmin = hostname === "admin.platform.com" || hostname.startsWith("admin.localhost");

  // Rewrite logic
  if (isSuperAdmin) {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
  }

  if (
    subdomain !== "www" &&
    !subdomain.includes("localhost") &&
    subdomain !== "platform" &&
    !hostname.endsWith(".vercel.app")
  ) {
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
