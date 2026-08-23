/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as blogApiKeys from "../blogApiKeys.js";
import type * as blogPosts from "../blogPosts.js";
import type * as clients from "../clients.js";
import type * as contracts from "../contracts.js";
import type * as designDemos from "../designDemos.js";
import type * as leads from "../leads.js";
import type * as lib_ensureClient from "../lib/ensureClient.js";
import type * as lib_removeDesignDemos from "../lib/removeDesignDemos.js";
import type * as lib_tokens from "../lib/tokens.js";
import type * as statuses from "../statuses.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  blogApiKeys: typeof blogApiKeys;
  blogPosts: typeof blogPosts;
  clients: typeof clients;
  contracts: typeof contracts;
  designDemos: typeof designDemos;
  leads: typeof leads;
  "lib/ensureClient": typeof lib_ensureClient;
  "lib/removeDesignDemos": typeof lib_removeDesignDemos;
  "lib/tokens": typeof lib_tokens;
  statuses: typeof statuses;
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
