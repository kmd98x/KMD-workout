/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as exercises from "../exercises.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as logging from "../logging.js";
import type * as measurements from "../measurements.js";
import type * as profile from "../profile.js";
import type * as progress from "../progress.js";
import type * as stats from "../stats.js";
import type * as workout from "../workout.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  exercises: typeof exercises;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  logging: typeof logging;
  measurements: typeof measurements;
  profile: typeof profile;
  progress: typeof progress;
  stats: typeof stats;
  workout: typeof workout;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
