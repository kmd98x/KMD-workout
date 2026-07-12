import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/login"]);

export const proxy = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthed = await convexAuth.isAuthenticated();
  if (!isPublicRoute(request) && !isAuthed) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
  if (isPublicRoute(request) && isAuthed) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  // Run on every route except static assets, so auth redirects apply everywhere.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
