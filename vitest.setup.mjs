import { loadEnv } from "vite";
import { TextEncoder, TextDecoder } from "util"; // Import polyfills

// Polyfill TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Load environment variables
const env = loadEnv("", process.cwd());

// Polyfill import.meta.env for tests
globalThis.importMetaEnv = env;
