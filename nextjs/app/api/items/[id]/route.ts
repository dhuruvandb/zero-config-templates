import { NextRequest, NextResponse } from "next/server";
import { deleteItem, updateItem, getUserIdByEmail } from "../../db/sqlite";

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = getUserIdFromToken(authHeader);
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // If token contains email (old tokens), look up the user ID
  let actualUserId = userId;
  if (userId.includes("@")) {
    const resolvedId = getUserIdByEmail(userId);
    if (!resolvedId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    actualUserId = resolvedId;
  }

  const { id } = await params;
  const deleted = deleteItem(id, actualUserId);

  if (!deleted) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Item deleted" });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = getUserIdFromToken(authHeader);
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // If token contains email (old tokens), look up the user ID
  let actualUserId = userId;
  if (userId.includes("@")) {
    const resolvedId = getUserIdByEmail(userId);
    if (!resolvedId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    actualUserId = resolvedId;
  }

  const { id } = await params;
  const { name } = await request.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { message: "Item name is required" },
      { status: 400 }
    );
  }

  const updated = updateItem(id, actualUserId, name.trim());

  if (!updated) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ _id: id, name: name.trim(), userId: actualUserId });
}
