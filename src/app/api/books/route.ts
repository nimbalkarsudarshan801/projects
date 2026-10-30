import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const books = await prisma.book.findMany({ include: { category: true }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json(books);
}
const schema = z.object({ title: z.string(), author: z.string(), totalCopies: z.number().int().positive().default(1) });
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const book = await prisma.book.create({ data: { ...parsed.data, availableCopies: parsed.data.totalCopies } });
  return NextResponse.json(book, { status: 201 });
}
