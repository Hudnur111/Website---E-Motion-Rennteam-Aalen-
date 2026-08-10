// Set NEXT_PUBLIC_SITE_URL in production so canonical URLs, the sitemap,
// and robots.txt point at the real domain instead of this placeholder.
const DEFAULT_SITE_URL = "https://example.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/$/, "");
