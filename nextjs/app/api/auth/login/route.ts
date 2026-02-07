import { NextRequest, NextResponse } from "next/server";
import { validateUserCredentials } from "../../db/sqlite";
import { generateAccessToken } from "../../utils/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate user credentials from database
    const user = await validateUserCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT access token
    const accessToken = generateAccessToken(user.id);

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
