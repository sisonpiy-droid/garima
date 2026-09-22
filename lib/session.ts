import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}
