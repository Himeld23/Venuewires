import { NextResponse } from "next/server";

// Prototype stub. Backend phase: validate, persist to DB, route to venue/vendor, notify via WhatsApp/SMS/email.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.mobile) {
    return NextResponse.json({ ok: false, error: "Name and mobile are required" }, { status: 400 });
  }
  const ref = "VW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  console.log("[enquiry]", ref, body);
  return NextResponse.json({ ok: true, ref });
}
