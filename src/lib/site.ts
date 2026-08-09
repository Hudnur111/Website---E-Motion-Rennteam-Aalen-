/**
 * Canonical site origin, used for metadataBase, the sitemap, robots.txt and
 * JSON-LD structured data. Override via NEXT_PUBLIC_SITE_URL in production
 * (e.g. on Vercel) if the deployed domain differs from the fallback below.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://emotion-rennteam.de"
).replace(/\/$/, "");
