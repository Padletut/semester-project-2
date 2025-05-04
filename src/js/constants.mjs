/**
 * @file constants.mjs
 * @module constants
 * @description This module contains constants used throughout the application.
 * It includes API endpoints, storage keys, and other configuration values.
 * @example
 * ```javascript
 * import * as contants from './constants.mjs';
 * console.log(API_BASE_URL); // Outputs the base URL for the API
 * ```
 */
export const API_KEY = import.meta.env.VITE_API_KEY;
export const API_BASE_URL = "https://v2.api.noroff.dev";
export const API_AUTH = "/auth";
export const API_REGISTER = "/register";
export const API_LOGIN = "/login";
export const API_LISTINGS = "/auction/listings";
export const API_PROFILES = "/auction/profiles";
export const API_SEARCH = "/search";
export const STORAGE_KEYS = {
  PROFILE: "profile",
  ACCESS_TOKEN: "accessToken",
};
