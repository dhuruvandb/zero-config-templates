import prisma from "../lib/prisma";

export async function getAllItems() {
    return prisma.item.findMany();
}

export async function createItem(name: string) {
    return prisma.item.create({
        data: { name },
    });
}

export async function deleteItem(id: string) {
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Item not found");
    }
    return prisma.item.delete({ where: { id } });
}