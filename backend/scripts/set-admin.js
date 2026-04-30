import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { role: 'admin' },
    });

    console.log(`✅ User ${user.email} is now an admin!`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`❌ User with email ${email} not found`);
    } else {
      console.error('Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/set-admin.js <email>');
  process.exit(1);
}

setAdmin(email);

