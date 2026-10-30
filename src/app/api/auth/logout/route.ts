import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  const token = (await cookies()).get("session")?.value;
  if (token) {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await prisma.userSession.updateMany({ where: { tokenHash: hash }, data: { revokedAt: new Date() } });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("session");
  return res;
}
