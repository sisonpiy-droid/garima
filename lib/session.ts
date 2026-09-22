import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

/** For page components: like requireSession, but redirects instead of throwing. */
export async function requireSessionOrRedirect() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return session;
}
