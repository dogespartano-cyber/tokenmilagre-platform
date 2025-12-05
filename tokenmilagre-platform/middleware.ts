import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Feature Flags
const FEATURE_FLAGS = {
  API_V2_ENABLED: process.env.ENABLE_API_V2 === 'true' || false,
} as const;

// Matcher for API v2
const isApiV2Route = createRouteMatcher(['/api/v2(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 1. Feature Flag: API v2 Check
  if (isApiV2Route(req)) {
    if (!FEATURE_FLAGS.API_V2_ENABLED) {
      return NextResponse.json(
        {
          error: 'API v2 Temporarily Disabled',
          message: 'API v2 is currently undergoing database migration.',
          status: 503,
        },
        { status: 503 }
      );
    }
  }

  // 2. Protect routes if needed (e.g., /admin, /dashboard/perfil)
  // 2. Protect routes if needed (e.g., /admin, /dashboard/perfil)
  const isProtectedRoute = createRouteMatcher(['/membro(.*)', '/quiz(.*)']);
  if (isProtectedRoute(req)) await auth.protect();

  // Note: We are temporarily removing the NextAuth middleware call for /admin 
  // to avoid conflicts during this migration. 
  // If strict /admin protection is needed immediately, we should migrate admin to Clerk.
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
