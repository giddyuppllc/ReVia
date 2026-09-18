export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";
import { unsubscribeAddress } from "@/lib/audience";

// One-click unsubscribe. The token is an HMAC of the address, so a link can only
// remove the address it was issued for — not an arbitrary one someone types in.
async function unsubscribe(email: string, token: string) {
  const address = email.toLowerCase().trim();
  if (!address || !verifyUnsubscribeToken(address, token)) {
    return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
  }
  const done = await unsubscribeAddress(address);
  if (!done) {
    return NextResponse.json(
      { error: "We could not action that. Please email contact@revialife.com." },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  try {
    const { email, token } = (await request.json()) as { email?: string; token?: string };
    return await unsubscribe(email ?? "", token ?? "");
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// RFC 8058 one-click unsubscribe (List-Unsubscribe-Post) and plain link clicks.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return unsubscribe(searchParams.get("e") ?? "", searchParams.get("t") ?? "");
}
