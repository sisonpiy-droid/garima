import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "sisonpiy@gmail.com").trim().toLowerCase();

/**
 * Admin-only: creates the single owner (Garima) account. There is no public
 * signup — this app is for one author plus the admin who already exists.
 */
export async function POST(request: Request) {
  await requireAdmin();

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
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

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name: name || null, email, passwordHash, role: "USER" },
  });

  return NextResponse.json({ ok: true });
}
