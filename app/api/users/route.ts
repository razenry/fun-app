import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  try {
    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { class_name: { contains: search, mode: "insensitive" } },
              { notelp: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
