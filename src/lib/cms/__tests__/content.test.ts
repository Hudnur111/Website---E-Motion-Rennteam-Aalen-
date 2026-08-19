import { describe, expect, it } from "vitest";
import { isValidSlug, slugify } from "@/lib/cms/content";

describe("slugify", () => {
  it("lowercases and dashes separators", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips diacritics", () => {
    expect(slugify("Rückflügel Prüfung")).toBe("ruckflugel-prufung");
  });

  it("collapses repeated separators and trims leading/trailing dashes", () => {
    expect(slugify("  --Foo__Bar--  ")).toBe("foo-bar");
  });

  it("falls back to a default when nothing alphanumeric remains", () => {
    expect(slugify("!!!")).toBe("eintrag");
    expect(slugify("")).toBe("eintrag");
  });

  it("truncates very long input", () => {
    expect(slugify("a".repeat(200)).length).toBeLessThanOrEqual(80);
  });

  it("always produces output that isValidSlug accepts", () => {
    const inputs = ["Hello World!", "../../etc/passwd", "café münchen", "  ", "a/b/c", "ERT-12/24"];
    for (const input of inputs) {
      expect(isValidSlug(slugify(input))).toBe(true);
    }
  });
});

describe("isValidSlug", () => {
  it("accepts simple slugs", () => {
    expect(isValidSlug("aerodynamik")).toBe(true);
    expect(isValidSlug("aerodynamik-2")).toBe(true);
    expect(isValidSlug("ert-12-24")).toBe(true);
  });

  it("rejects path traversal attempts", () => {
    expect(isValidSlug("../../../etc/passwd")).toBe(false);
    expect(isValidSlug("..")).toBe(false);
    expect(isValidSlug("a/b")).toBe(false);
    expect(isValidSlug("a\\b")).toBe(false);
  });

  it("rejects empty, uppercase, and malformed slugs", () => {
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("Aerodynamik")).toBe(false);
    expect(isValidSlug("-leading-dash")).toBe(false);
    expect(isValidSlug("trailing-dash-")).toBe(false);
    expect(isValidSlug("double--dash")).toBe(false);
    expect(isValidSlug("has space")).toBe(false);
    expect(isValidSlug("has.dot")).toBe(false);
  });
});
