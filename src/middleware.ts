import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  console.log("Middleware working", token)
  const url = request.nextUrl;
  if (token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  } else if (!token && url.pathname !== "/") {
     return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/app/:path*",
    "/",
    "/home/:path*"
  ],
};
