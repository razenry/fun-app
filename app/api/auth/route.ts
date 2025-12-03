import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { key } = await req.json();

  if (key === process.env.SECRET_KEY) {
    const res = NextResponse.json({ success: true });

    res.cookies.set("authenticated", "true", {
      httpOnly: true,
      path: "/",
    });

    return res;
  }

  return NextResponse.json({ error: "Invalid key" }, { status: 401 });
}
