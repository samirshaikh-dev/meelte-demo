import { NextResponse } from "next/server";
import { getClientIdentifier, loginHr } from "@/services/hr";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const clientIp = await getClientIdentifier(request);
  const result = await loginHr({
    email: body?.email,
    password: body?.password,
    clientIp,
  });

  return NextResponse.json(result.data, { status: result.status });
}
