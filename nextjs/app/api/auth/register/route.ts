import { NextRequest, NextResponse } from "next/server";
import { userExists, createUser } from "../../db/sqlite";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check if user already exists
    if (userExists(email)) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Create user in database
    const user = createUser(email, password);

    // Generate a simple token with user ID (in production, use JWT)
    const accessToken = Buffer.from(`${user.id}:${Date.now()}`).toString(
      "base64"
    );

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Registration failed", error: String(error) },
      { status: 500 }
    );
  }
}
