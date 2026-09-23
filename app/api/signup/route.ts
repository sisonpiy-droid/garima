import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "sisonpiy@gmail.com").trim().toLowerCase();

// Avoids visually ambiguous characters (0/O, 1/l/I).
const ONE_TIME_PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

function generateOneTimePassword(length = 12) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ONE_TIME_PASSWORD_CHARS[randomInt(ONE_TIME_PASSWORD_CHARS.length)];
  }
  return out;
}

/**
 * Admin-only: creates the single owner (Garima) account with a freshly
 * generated one-time password, returned once in the response so the admin
 * can share it with her. She must change it on first sign-in.
 */
export async function POST(request: Request) {
  await requireAdmin();

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  if (email === ADMIN_EMAIL) {
    return NextResponse.json({ error: "That email is reserved for the admin account." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const owner = await prisma.user.findFirst({ where: { role: "USER" } });
  if (owner) {
    return NextResponse.json({ error: "An owner account already exists." }, { status: 409 });
  }

  const oneTimePassword = generateOneTimePassword();
  const passwordHash = await bcrypt.hash(oneTimePassword, 12);

  await prisma.user.create({
    data: { name: name || null, email, passwordHash, role: "USER", mustChangePassword: true },
  });

  return NextResponse.json({ ok: true, oneTimePassword });
}
