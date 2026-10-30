import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().optional() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.json({ error: "Email in use" }, { status: 409 });
  const hash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({ data: { email: parsed.data.email, passwordHash: hash, name: parsed.data.name, status: "ACTIVE" } });
  const studentRole = await prisma.role.findUnique({ where: { key: "STUDENT" } });
  if (studentRole) await prisma.userRole.create({ data: { userId: user.id, roleId: studentRole.id } });
  await prisma.studentProfile.create({ data: { userId: user.id, studentNumber: "STU-" + user.id.slice(0, 8) } });
  const { token, expiresAt } = await createSession(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", expires: expiresAt, path: "/" });
  return res;
}
