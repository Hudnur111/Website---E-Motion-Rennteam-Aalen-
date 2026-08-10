import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement IntersectionObserver/ResizeObserver, which
// framer-motion's viewport ("whileInView") features rely on. Provide
// minimal no-op stand-ins so components using <Reveal>/<Stagger> etc. can
// be rendered in tests.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = MockObserver;
}

if (typeof globalThis.ResizeObserver === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = MockObserver;
}
