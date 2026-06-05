import prisma from "../lib/prisma";

export async function getAllItems(userId: string) {
    return prisma.item.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export async function createItem(name: string, userId: string) {
    return prisma.item.create({
        data: { name, userId },
    });
}

export async function updateItem(id: string, name: string, userId: string) {
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Item not found");
    }
    if (existing.userId !== userId) {
        throw new Error("Forbidden");
    }
    return prisma.item.update({
        where: { id },
        data: { name },
    });
}

export async function deleteItem(id: string, userId: string) {
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Item not found");
    }
    if (existing.userId !== userId) {
        throw new Error("Forbidden");
    }
    return prisma.item.delete({ where: { id } });
}