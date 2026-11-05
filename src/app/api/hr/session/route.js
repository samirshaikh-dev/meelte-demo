import { NextResponse } from "next/server";
import { getHrSession } from "@/services/hr";

export async function GET() {
  const session = await getHrSession();
  return NextResponse.json(session);
}
