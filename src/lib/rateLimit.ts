import type { NextRequest } from "next/server";

/**
 * Minimal in-memory fixed-window rate limiter. Good enough to blunt naive
 * form-spam bots on a single long-lived Node.js server process. It does
 * *not* work across multiple serverless instances/regions since each
 * process has its own memory — if the site moves to a multi-instance
 * deployment, swap this for a shared store (Redis/Upstash, etc.).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

/** Best-effort client IP extraction behind typical reverse proxies. */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
