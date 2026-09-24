import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "sisonpiy@gmail.com").trim().toLowerCase();
  const adminPassword = "piyush@0206";
  const adminName = "Piyush";

  console.log(`Setting up admin account for: ${adminEmail}...`);

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "ADMIN",
      mustChangePassword: false,
      name: adminName,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      mustChangePassword: false,
      name: adminName,
    },
  });

  console.log(`Admin account ready!`);
  console.log(`ID: ${admin.id}`);
  console.log(`Email: ${admin.email}`);
  console.log(`Role: ${admin.role}`);
  console.log(`Must change password: ${admin.mustChangePassword}`);

  // Also check existing users in the database
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, mustChangePassword: true, createdAt: true },
  });
  console.log("\nAll users currently in database:");
  console.table(allUsers);
}

main()
  .catch((e) => {
    console.error("Error setting up admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
