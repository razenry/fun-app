// app/api/users/[id]/route.ts

import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ tunggu params dulu
    const userId = Number(id);

    if (isNaN(userId)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete" }), { status: 500 });
  }
}
