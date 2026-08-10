// Matches the domain used throughout the site's own contact/impressum
// content (e.g. vorstand@emotion-rennteam.de). Override with
// NEXT_PUBLIC_SITE_URL if the deployed domain ever differs.
const DEFAULT_SITE_URL = "https://www.emotion-rennteam.de";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/$/, "");
