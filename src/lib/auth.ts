import { prisma } from "./prisma";
import argon2 from "argon2";
import crypto from "crypto";

export async function hashPassword(pw: string) {
  return argon2.hash(pw, { type: argon2.argon2id });
}
export async function verifyPassword(hash: string, pw: string) {
  return argon2.verify(hash, pw);
}
export function newSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}
export async function createSession(userId: string) {
  const token = newSessionToken();
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.userSession.create({ data: { userId, tokenHash: hash, expiresAt } });
  return { token, expiresAt };
}
export async function getSession(token: string | undefined) {
  if (!token) return null;
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const s = await prisma.userSession.findUnique({ where: { tokenHash: hash }, include: { user: { include: { roles: { include: { role: true } } } } } });
  if (!s || s.revokedAt || s.expiresAt < new Date()) return null;
  return s;
}
