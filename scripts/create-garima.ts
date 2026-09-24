import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "garimakhurana121@gmail.com";
  const name = "Garima";
  const tempPassword = "Garima@Login2026";

  console.log(`Creating/updating owner account for ${email}...`);

  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "USER",
      mustChangePassword: true,
      clearPasswordForAdmin: tempPassword,
    },
    create: {
      name,
      email,
      passwordHash,
      role: "USER",
      mustChangePassword: true,
      clearPasswordForAdmin: tempPassword,
    },
  });

  console.log("Garima account ready in database!");
  console.log(`Email: ${user.email}`);
  console.log(`Temp Password: ${tempPassword}`);
  console.log(`Must Change Password: ${user.mustChangePassword}`);
}

main()
  .catch((e) => {
    console.error("Error creating Garima:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
