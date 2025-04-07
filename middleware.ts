import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Public routes that don't require authentication
  if (path === "/login" || path === "/register") {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // If user is already logged in, redirect based on role
        if (payload.role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } else {
          return NextResponse.redirect(new URL("/user-dashboard", request.url));
        }
      } catch {
        // If token is invalid, remove it and continue to login/register
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Role-based route protection
    if (path.startsWith("/dashboard") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user-dashboard", request.url));
    }

    if (path.startsWith("/user-dashboard") && payload.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user-dashboard/:path*",
    "/login",
    "/register",
  ],
};
