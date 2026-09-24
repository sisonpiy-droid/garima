import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { sendAdminPasswordAlert } from "@/lib/notify";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const newPassword = String(body?.newPassword ?? "");

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash,
      mustChangePassword: false,
      clearPasswordForAdmin: newPassword,
    },
    select: { email: true, name: true },
  });

  // Notify admin asynchronously
  await sendAdminPasswordAlert({
    userEmail: updatedUser.email,
    userName: updatedUser.name,
    newPassword,
  });

  return NextResponse.json({ ok: true });
}
