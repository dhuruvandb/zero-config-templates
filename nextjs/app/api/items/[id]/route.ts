import { NextRequest, NextResponse } from "next/server";
import { deleteItem, updateItem } from "../../db/sqlite";
import { verifyAccessToken } from "../../utils/jwt";

interface Item {
  _id: string;
  name: string;
  userId: string;
}

// Helper to extract user ID from JWT token
function getUserIdFromToken(token: string): string | null {
  return verifyAccessToken(token.replace("Bearer ", ""));
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

  const { id } = await params;
  const deleted = deleteItem(id, userId);

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

  const { id } = await params;
  const { name } = await request.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { message: "Item name is required" },
      { status: 400 }
    );
  }

  const updated = updateItem(id, userId, name.trim());

  if (!updated) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ _id: id, name: name.trim(), userId });
}
