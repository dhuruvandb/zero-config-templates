import { NextRequest, NextResponse } from "next/server";
import { findUserByEmailPassword } from "../../db/sqlite";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user from database
    const user = findUserByEmailPassword(email, password);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate a simple token with user ID (in production, use JWT)
    const accessToken = Buffer.from(`${user.id}:${Date.now()}`).toString(
      "base64"
    );

    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
