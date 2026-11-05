import { NextResponse } from "next/server";
import { logoutHr } from "@/services/hr";

export async function POST() {
  const result = await logoutHr();
  return NextResponse.json(result);
}
