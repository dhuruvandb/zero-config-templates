import { NextRequest, NextResponse } from "next/server";
import { getItemsByUserId, createItem } from "../db/sqlite";
import { verifyAccessToken } from "../utils/jwt";

interface Item {
  _id: string;
  name: string;
  userId: string;
}

// Helper to extract user ID from JWT token
function getUserIdFromToken(token: string): string | null {
  return verifyAccessToken(token.replace("Bearer ", ""));
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = getUserIdFromToken(authHeader);
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const userItems = getItemsByUserId(userId);
  return NextResponse.json(userItems);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = getUserIdFromToken(authHeader);
  
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const { name } = await request.json();

  const newItem = createItem(userId, name);
  return NextResponse.json(newItem);
}
