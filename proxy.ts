import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/login"]);

export const proxy = convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const isAuthed = await convexAuth.isAuthenticated();
    if (!isPublicRoute(request) && !isAuthed) {
      return nextjsMiddlewareRedirect(request, "/login");
    }
    if (isPublicRoute(request) && isAuthed) {
      return nextjsMiddlewareRedirect(request, "/");
    }
  },
  {
    // Without this, the auth cookies default to browser session cookies
    // (no Expires/Max-Age), so they're wiped whenever the PWA's process is
    // killed (e.g. backgrounded mid-workout on iOS/Android), forcing a
    // re-login even though the refresh token is still valid server-side.
    // Match the cookie lifetime to the refresh token's 30-day lifetime.
    cookieConfig: { maxAge: 60 * 60 * 24 * 30 },
  },
);

export const config = {
  // Run on every route except static assets, so auth redirects apply everywhere.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
