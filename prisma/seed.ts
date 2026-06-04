import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'National', slug: 'national', description: 'National news and current affairs' },
  { name: 'International', slug: 'international', description: 'Global news and world events' },
  { name: 'Politics', slug: 'politics', description: 'Political news and analysis' },
  { name: 'Business', slug: 'business', description: 'Business, markets, and economy' },
  { name: 'Technology', slug: 'technology', description: 'Technology and innovation news' },
  { name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
  { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment and celebrity news' },
  { name: 'Health', slug: 'health', description: 'Health and wellness news' },
  { name: 'Science', slug: 'science', description: 'Science and research discoveries' },
  { name: 'Education', slug: 'education', description: 'Education news and policies' },
  { name: 'Opinion', slug: 'opinion', description: 'Editorials and opinion pieces' },
  { name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle, travel, and culture' },
];

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ── Seed Admin ──────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@indotimesmedia.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Admin already exists: ${adminEmail}`);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  }

  // ── Seed Categories ─────────────────────────────────────────
  let categoriesCreated = 0;
  let categoriesSkipped = 0;

  for (const category of defaultCategories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (existing) {
      categoriesSkipped++;
    } else {
      await prisma.category.create({ data: category });
      categoriesCreated++;
    }
  }

  console.log(
    `✅ Categories: ${categoriesCreated} created, ${categoriesSkipped} already existed`,
  );

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
