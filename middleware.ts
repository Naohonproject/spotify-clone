// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  // If user is logged in, token will exist
  // when we define NextAuth function in [...nextauth].js ,
  // if we set NEXTAUTH_SECRET, we will not need to set secret option, then the process.env.NEXTAUTH_SECRET
  // will always set for secret option, then when we sign in successfully, Spotify will use our  process.env.NEXTAUTH_SECRET to make a token
  // send to client, client store it in cookie or Authorization header, we use getToken then pass to it our secret to decode the token from the client

  // take the token from user request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow request if (1) token exists
  // OR (2) it is a request for NextAuth session & provider
  // OR (3) it is a request to '/_next' (/_next/static/)
  if (token || pathname.includes("/api/auth") || pathname.includes("/_next")) {
    // has valid token but try to login again , no, not alow to log in again, redirect to homepage
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // has valid token, just no try to  login again request, yes, let's next to the page
    return NextResponse.next();
  }

  // no has valid token , try to request page, no have login first to take token to restore in some where then try to request again
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // not go into two above case, ok , let's next to page
  return NextResponse.next();
};
