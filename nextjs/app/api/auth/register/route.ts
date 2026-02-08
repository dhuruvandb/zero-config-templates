import { NextRequest, NextResponse } from "next/server";
import { userExists, createUser } from "../../db/sqlite";
import { generateAccessToken } from "../../utils/jwt";

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

    // Create user in database with hashed password
    const user = await createUser(email, password);

    // Generate JWT access token
    const accessToken = generateAccessToken(user.id);

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Registration failed", error: String(error) },
      { status: 500 }
    );
  }
}
