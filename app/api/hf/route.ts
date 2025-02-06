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
  return NextResponse.json({ message: "Success", isOk: true }, { status: 200 });
}
