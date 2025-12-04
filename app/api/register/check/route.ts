import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { notelp } = await req.json();

  const user = await prisma.user.findUnique({
    where: { notelp },
  });

  return NextResponse.json({ exists: !!user });
}
