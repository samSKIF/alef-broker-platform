import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Supabase Auth session middleware. Runs on every navigation, calls
// supabase.auth.getUser() (which under the hood re-validates and, if
// expiring, refreshes the JWT cookie), then writes the rotated cookies
// onto the response. Without this, the broker's session would silently
// expire and the next page render would redirect to /welcome.
//
// Matcher excludes Next.js internals, public assets, the manifest +
// service worker, and the static icon metadata routes — none of those
// need a session and skipping them keeps middleware off the hot path.

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Apply rotated cookies to both the inbound request (so downstream
          // server components see the new value) and the outgoing response
          // (so the browser persists it).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|icon0|icon1|apple-icon|manifest.webmanifest|sw.js|offline|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
