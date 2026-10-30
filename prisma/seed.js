const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
const p = new PrismaClient();

async function main() {
  const roles = [
    { key: "SUPERADMIN", name: "Superadmin", isSystem: true },
    { key: "ADMIN", name: "Admin", isSystem: true },
    { key: "LIBRARIAN", name: "Librarian", isSystem: true },
    { key: "STUDENT", name: "Student", isSystem: true },
  ];
  for (const r of roles) {
    await p.role.upsert({ where: { key: r.key }, update: {}, create: r });
  }
  // create superadmin if env provided
  const email = process.env.INITIAL_SUPERADMIN_EMAIL;
  const password = process.env.INITIAL_SUPERADMIN_PASSWORD;
  if (email && password) {
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await p.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash: hash, status: "ACTIVE", emailVerified: new Date() },
    });
    const role = await p.role.findUnique({ where: { key: "SUPERADMIN" } });
    await p.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: { granted: true },
      create: { userId: user.id, roleId: role.id, granted: true },
    });
    console.log("Superadmin ensured:", email);
  }
  // default settings
  await p.applicationSetting.upsert({
    where: { key: "app.name" },
    update: {},
    create: { key: "app.name", value: "SraswatiLibrary", type: "string" },
  });
  console.log("Seed done");
}

main().finally(() => p.$disconnect());
