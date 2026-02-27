export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/individual/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
