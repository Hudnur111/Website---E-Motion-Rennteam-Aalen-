import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import * as formDelivery from "@/lib/formDelivery";

function postRequest(body: unknown, ip = `1.2.3.${Math.floor(Math.random() * 250)}`) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Sponsoring",
  message: "Wir würden gerne unterstützen.",
  consent: "true",
};

describe("POST /api/contact", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("accepts a valid submission and delivers it", async () => {
    const deliverSpy = vi
      .spyOn(formDelivery, "deliverFormSubmission")
      .mockResolvedValue(undefined);

    const response = await POST(postRequest(validPayload));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(deliverSpy).toHaveBeenCalledWith("contact", expect.objectContaining({ name: "Ada Lovelace" }));
  });

  it("rejects an invalid submission with field errors", async () => {
    const response = await POST(postRequest({ ...validPayload, email: "not-an-email" }));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.errors.email).toBeDefined();
  });

  it("rejects malformed JSON bodies", async () => {
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" },
      body: "not json",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("silently accepts but does not deliver honeypot-tripped submissions", async () => {
    const deliverSpy = vi
      .spyOn(formDelivery, "deliverFormSubmission")
      .mockResolvedValue(undefined);

    const response = await POST(postRequest({ ...validPayload, website: "http://spam.example" }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(deliverSpy).not.toHaveBeenCalled();
  });

  it("rate-limits repeated submissions from the same IP", async () => {
    vi.spyOn(formDelivery, "deliverFormSubmission").mockResolvedValue(undefined);
    const ip = `10.0.0.${Math.floor(Math.random() * 250)}`;

    let lastResponse;
    for (let i = 0; i < 6; i += 1) {
      lastResponse = await POST(postRequest(validPayload, ip));
    }

    expect(lastResponse?.status).toBe(429);
  });
});
