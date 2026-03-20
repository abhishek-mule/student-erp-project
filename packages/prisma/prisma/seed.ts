import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo College',
      slug: 'demo',
      plan: 'FREE',
    },
  });

  console.log(`Tenant created: ${tenant.name} (${tenant.id})`);

  // 2. Sample Passwords (hashed)
  const saltRounds = 10;
  const hash = await bcrypt.hash('password', saltRounds);

  // 3. Create College Admin
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'College Admin',
      role: 'COLLEGE_ADMIN',
      tenant_id: tenant.id,
      passwordHash: hash,
    },
  });

  // 4. Create Teacher
  await prisma.user.upsert({
    where: { email: 'teacher@demo.com' },
    update: {},
    create: {
      email: 'teacher@demo.com',
      name: 'Demo Teacher',
      role: 'TEACHER',
      tenant_id: tenant.id,
      passwordHash: hash,
    },
  });

  // 5. Create Student User
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      name: 'Demo Student',
      role: 'STUDENT',
      tenant_id: tenant.id,
      passwordHash: hash,
    },
  });

  // 6. Create Student Profile
  await prisma.student.upsert({
    where: { user_id: studentUser.id },
    update: {},
    create: {
      tenant_id: tenant.id,
      user_id: studentUser.id,
      roll_no: 'DEMO-101',
      batch: '2026',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
