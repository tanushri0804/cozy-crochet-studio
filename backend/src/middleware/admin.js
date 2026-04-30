import { PrismaClient } from '@prisma/client';
import { authenticateToken } from './auth.js';

const prisma = new PrismaClient();

// Middleware to check if user is admin
// This should be used AFTER authenticateToken
export const requireAdmin = async (req, res, next) => {
  try {
    // Get user from database to check role
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

