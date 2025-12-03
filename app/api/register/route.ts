import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, className, notelp, personality } = await req.json();

    // Validasi
    if (!name || !className || !notelp || !personality) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah nomor telepon sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { notelp },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Nomor telepon sudah digunakan" },
        { status: 409 }
      );
    }

    // Simpan data baru
    const newUser = await prisma.user.create({
      data: {
        name,
        class_name: className,
        notelp,
        personality,
      },
    });

    return NextResponse.json({
      message: "Pendaftaran berhasil",
      data: newUser,
    });

  } catch (err: any) {
    console.error("API Error:", err);

    // Jika Prisma error karena unique constraint
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Nomor telepon sudah digunakan" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Gagal menyimpan data" },
      { status: 500 }
    );
  }
}
