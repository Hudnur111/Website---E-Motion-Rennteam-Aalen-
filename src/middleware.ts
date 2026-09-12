/**
 * Next.js Edge Middleware entry point.
 *
 * Next.js only discovers middleware when it lives in a file named exactly
 * `src/middleware.ts` (or `middleware.ts` at the project root) and exports
 * a default function (or a named export called `middleware`). The actual
 * logic lives in `src/proxy.ts` — this file simply re-exports it under the
 * names Next.js requires, plus the `config` matcher so the framework knows
 * which routes to intercept.
 *
 * DO NOT rename this file — the name `middleware.ts` is mandatory.
 */
export { proxy as default, config } from "./proxy";
