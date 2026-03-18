import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return NextResponse.next();

  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl;

  const subdomain = hostname.split(".")[0];
  const isSuperAdmin = hostname === "admin.platform.com" || hostname.startsWith("admin.localhost");

  // Auth protection for non-public routes
  const authObj = await auth();
  if (!authObj.userId) {
    return authObj.redirectToSignIn({ returnBackUrl: request.url });
  }

  // Rewrite logic
  if (isSuperAdmin) {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
  }

  if (
    subdomain !== "www" &&
    !subdomain.includes("localhost") &&
    subdomain !== "platform"
  ) {
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
