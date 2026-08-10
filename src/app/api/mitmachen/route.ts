import { NextRequest, NextResponse } from "next/server";
import { validateMemberApplicationForm } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { deliverFormSubmission } from "@/lib/formDelivery";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`mitmachen:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const result = validateMemberApplicationForm(body);
  if (!result.valid) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  if (!result.isBot) {
    await deliverFormSubmission("mitmachen", result.data);
  }

  return NextResponse.json({ ok: true });
}
