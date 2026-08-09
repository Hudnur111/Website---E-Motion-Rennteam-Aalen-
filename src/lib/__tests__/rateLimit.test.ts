import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "@/lib/rateLimit";

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
});
