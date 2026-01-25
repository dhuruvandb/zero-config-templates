import { NextRequest, NextResponse } from "next/server";
import { getItemsByUserId, createItem, getUserIdByEmail } from "../db/sqlite";

interface Item {
  _id: string;
  name: string;
  userId: string;
}

// Helper to extract user ID from token
function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token.replace("Bearer ", ""), "base64").toString(
      "utf-8"
    );
    return decoded.split(":")[0]; // Returns the user ID or email
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let userId = getUserIdFromToken(authHeader);
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // If token contains email (old tokens), look up the user ID
  if (userId.includes("@")) {
    const actualUserId = getUserIdByEmail(userId);
    if (!actualUserId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    userId = actualUserId;
  }

  const userItems = getItemsByUserId(userId as string);
  return NextResponse.json(userItems);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let userId = getUserIdFromToken(authHeader);
  
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // If token contains email (old tokens), look up the user ID
  if (userId.includes("@")) {
    const actualUserId = getUserIdByEmail(userId);
    if (!actualUserId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    userId = actualUserId;
  }

  const { name } = await request.json();

  const newItem = createItem(userId as string, name);
  return NextResponse.json(newItem);
}
