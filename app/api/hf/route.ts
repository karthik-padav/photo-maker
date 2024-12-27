import { triggerHf } from "@/lib/common";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized", isOk: false },
      { status: 401 }
    );
  }
  const data = await triggerHf(token);
  return NextResponse.json(
    { message: "Success", isOk: true, data },
    { status: 200 }
  );
}
