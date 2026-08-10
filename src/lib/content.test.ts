import { describe, expect, it } from "vitest";
import { getNews, getSponsors, getVehicles } from "@/lib/content";

describe("content.ts", () => {
  it("sorts news posts by date, newest first", () => {
    const news = getNews();
    expect(news.length).toBeGreaterThan(0);

    const dates = news.map((post) => new Date(post.date).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("sorts sponsors by tier (Platin > Gold > Silber > Partner)", () => {
    const sponsors = getSponsors();
    expect(sponsors.length).toBeGreaterThan(0);

    const tierOrder = ["Platin", "Gold", "Silber", "Partner"];
    const tierIndices = sponsors.map((s) => tierOrder.indexOf(s.tier));
    const sorted = [...tierIndices].sort((a, b) => a - b);
    expect(tierIndices).toEqual(sorted);
  });

  it("sorts vehicles by year, newest first", () => {
    const vehicles = getVehicles();
    expect(vehicles.length).toBeGreaterThan(0);

    const years = vehicles.map((v) => v.year);
    const sorted = [...years].sort((a, b) => b - a);
    expect(years).toEqual(sorted);
  });

  it("derives a slug from the markdown filename for every collection entry", () => {
    for (const post of getNews()) {
      expect(post.slug).not.toMatch(/\.md$/);
      expect(post.slug.length).toBeGreaterThan(0);
    }
  });
});
