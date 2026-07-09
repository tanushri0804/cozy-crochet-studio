import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'test@admin.com';
  const password = 'Test@123';
  
  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existing) {
      console.log('Admin user already exists:', email);
      // Update to admin role just in case
      await prisma.user.update({
        where: { email },
        data: { role: 'admin' }
      });
      console.log('Updated to admin role');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Admin',
        role: 'admin'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('ID:', admin.id);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
