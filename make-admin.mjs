import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const user = await prisma.user.update({
      where: { email: 'tanushri18100@gmail.com' },
      data: { role: 'admin' },
    });
    console.log(`✅ ${user.email} is now an admin!`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.log('❌ User not found. Please sign up first at http://localhost:5173/auth');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
