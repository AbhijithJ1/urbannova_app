import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create wards (real Bangalore wards)
  const wardNames = [
    "Koramangala", "Indiranagar", "Whitefield", "Jayanagar",
    "Rajajinagar", "Hebbal", "BTM Layout", "Yelahanka",
    "Marathahalli", "Electronic City", "JP Nagar", "Malleshwaram",
  ];

  const wards = await Promise.all(
    wardNames.map((name) =>
      db.ward.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  console.log(`✅ Created ${wards.length} wards`);

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  await db.user.upsert({
    where: { email: "admin@urbannova.in" },
    update: {},
    create: {
      name: "City Administrator",
      email: "admin@urbannova.in",
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin: admin@urbannova.in / admin123`);

  console.log("🎉 Seeding complete! Citizens can now register and report issues.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
