import { describe, expect, it } from "vitest";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getGallery,
  getNews,
  getNewsBySlug,
  getPage,
  getPositions,
  getResults,
  getSponsors,
  getTeam,
  getVehicles,
} from "@/lib/content";

// These tests read the real markdown content under content/, exercising the
// same fs + gray-matter code path the site uses at build time.

describe("getTeam", () => {
  it("returns team members sorted by their order field", () => {
    const team = getTeam();
    expect(team.length).toBeGreaterThan(0);
    const orders = team.map((member) => member.order ?? 99);
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
  });

  it("gives every member a slug and name", () => {
    for (const member of getTeam()) {
      expect(member.slug).toBeTruthy();
      expect(member.name).toBeTruthy();
    }
  });
});

describe("getVehicles", () => {
  it("returns vehicles sorted newest year first", () => {
    const vehicles = getVehicles();
    expect(vehicles.length).toBeGreaterThan(0);
    for (let i = 1; i < vehicles.length; i += 1) {
      expect(vehicles[i - 1].year).toBeGreaterThanOrEqual(vehicles[i].year);
    }
  });
});

describe("getSponsors", () => {
  it("orders sponsors Platin > Gold > Silber > Partner", () => {
    const tierRank: Record<string, number> = { Platin: 0, Gold: 1, Silber: 2, Partner: 3 };
    const sponsors = getSponsors();
    const ranks = sponsors.map((s) => tierRank[s.tier]);
    const sorted = [...ranks].sort((a, b) => a - b);
    expect(ranks).toEqual(sorted);
  });
});

describe("news", () => {
  it("returns news sorted newest first", () => {
    const news = getNews();
    expect(news.length).toBeGreaterThan(0);
    for (let i = 1; i < news.length; i += 1) {
      expect(new Date(news[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(news[i].date).getTime()
      );
    }
  });

  it("getNewsBySlug finds an existing post by slug", () => {
    const [first] = getNews();
    expect(getNewsBySlug(first.slug)?.slug).toBe(first.slug);
  });

  it("getNewsBySlug returns undefined for an unknown slug", () => {
    expect(getNewsBySlug("this-slug-does-not-exist")).toBeUndefined();
  });
});

describe("blog", () => {
  it("returns blog posts sorted newest first", () => {
    const posts = getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i += 1) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      );
    }
  });

  it("getBlogPostBySlug returns undefined for an unknown slug", () => {
    expect(getBlogPostBySlug("this-slug-does-not-exist")).toBeUndefined();
  });
});

describe("getPage", () => {
  it("returns undefined for a page slug that doesn't exist", () => {
    expect(getPage("this-page-does-not-exist")).toBeUndefined();
  });
});

describe("getGallery", () => {
  it("returns an array of images with a slug and image path each", () => {
    const gallery = getGallery();
    expect(Array.isArray(gallery)).toBe(true);
    for (const image of gallery) {
      expect(image.slug).toBeTruthy();
      expect(image.image).toBeTruthy();
    }
  });
});

describe("getResults", () => {
  it("returns results sorted newest year first", () => {
    const results = getResults();
    for (let i = 1; i < results.length; i += 1) {
      expect(results[i - 1].year).toBeGreaterThanOrEqual(results[i].year);
    }
  });
});

describe("getPositions", () => {
  it("returns an array (possibly empty) of open positions", () => {
    expect(Array.isArray(getPositions())).toBe(true);
  });
});
