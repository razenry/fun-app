import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { notelp } = await req.json();

    const exists = await prisma.user.findUnique({
      where: { notelp },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Nomor telepon sudah terdaftar!" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
