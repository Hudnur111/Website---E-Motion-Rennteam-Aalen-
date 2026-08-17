import { beforeEach, describe, expect, it, vi } from "vitest";
import { _getTrackedBucketCountForTesting, checkRateLimit } from "@/lib/rateLimit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the configured limit", () => {
    const key = `test-${Math.random()}`;
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = `test-${Math.random()}`;
    checkRateLimit(key, 2, 60_000);
    checkRateLimit(key, 2, 60_000);
    expect(checkRateLimit(key, 2, 60_000)).toBe(false);
  });

  it("keeps separate counters per key", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    checkRateLimit(keyA, 1, 60_000);
    expect(checkRateLimit(keyA, 1, 60_000)).toBe(false);
    expect(checkRateLimit(keyB, 1, 60_000)).toBe(true);
  });

  it("resets the counter once the window has elapsed", () => {
    vi.useFakeTimers();
    const key = `test-window-${Math.random()}`;
    expect(checkRateLimit(key, 1, 1_000)).toBe(true);
    expect(checkRateLimit(key, 1, 1_000)).toBe(false);
    vi.advanceTimersByTime(1_001);
    expect(checkRateLimit(key, 1, 1_000)).toBe(true);
    vi.useRealTimers();
  });

  it("evicts expired buckets instead of growing the in-memory map forever", () => {
    // Without eviction, one bucket per distinct key would stay in memory
    // for the life of the process — e.g. an attacker cycling through
    // spoofed `x-forwarded-for` values, or just many years of real
    // visitors. Fill past the internal cap with short-lived, now-expired
    // buckets and confirm a later call sweeps them out rather than
    // letting the map grow past its bound.
    vi.useFakeTimers();
    const overflowPrefix = `overflow-${Math.random()}-`;
    const bucketsToFill = 5_000; // matches MAX_TRACKED_BUCKETS in rateLimit.ts
    for (let i = 0; i < bucketsToFill; i += 1) {
      checkRateLimit(`${overflowPrefix}${i}`, 1, 1_000);
    }
    expect(_getTrackedBucketCountForTesting()).toBeGreaterThanOrEqual(bucketsToFill);

    vi.advanceTimersByTime(1_001);
    checkRateLimit(`${overflowPrefix}trigger`, 1, 1_000);

    // The sweep should have dropped all the now-expired buckets, leaving
    // only the freshly inserted one (plus whatever unrelated, unexpired
    // buckets other tests in this run happen to hold).
    expect(_getTrackedBucketCountForTesting()).toBeLessThan(bucketsToFill);
    vi.useRealTimers();
  });
});
