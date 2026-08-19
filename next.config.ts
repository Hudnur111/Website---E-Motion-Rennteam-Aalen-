import type { NextConfig } from "next";

// A strict, hash/nonce-based script-src isn't viable here without switching
// every page to dynamic rendering: Next.js injects its own per-page inline
// bootstrap script (RSC/hydration payload), which differs per page and per
// build, so it can't be allowlisted by a static hash, and nonces require
// forgoing static generation site-wide (per Next's own CSP docs). This site
// is almost entirely statically generated, so that trade isn't worth it for
// a defense-in-depth header — this follows Next's documented "Without
// Nonces" baseline CSP instead: https://nextjs.org/docs/app/guides/content-security-policy
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  // React/framer-motion set inline `style` attributes at render time, so
  // style-src needs 'unsafe-inline' too. CSS injection is a much
  // lower-severity risk than script injection.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
