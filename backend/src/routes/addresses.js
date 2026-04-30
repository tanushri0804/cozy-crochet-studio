import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's addresses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({ addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single address
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const address = await prisma.address.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ address });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create address
router.post('/',
  authenticateToken,
  [
    body('fullName').trim().notEmpty(),
    body('street').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('zipCode').trim().notEmpty(),
    body('country').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { isDefault, ...addressData } = req.body;

      // If this is set as default or it's the first address, unset other defaults
      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId: req.user.userId },
          data: { isDefault: false },
        });
      } else {
        // Check if this is the first address
        const addressCount = await prisma.address.count({
          where: { userId: req.user.userId },
        });
        if (addressCount === 0) {
          addressData.isDefault = true;
        }
      }

      const address = await prisma.address.create({
        data: {
          ...addressData,
          userId: req.user.userId,
          isDefault: isDefault ?? false,
        },
      });

      res.status(201).json({
        message: 'Address created successfully',
        address,
      });
    } catch (error) {
      console.error('Create address error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update address
router.put('/:id',
  authenticateToken,
  [
    body('fullName').optional().trim().notEmpty(),
    body('street').optional().trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Verify address belongs to user
      const existingAddress = await prisma.address.findFirst({
        where: {
          id: req.params.id,
          userId: req.user.userId,
        },
      });

      if (!existingAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }

      const { isDefault, ...updateData } = req.body;

      // If setting as default, unset others
      if (isDefault) {
        await prisma.address.updateMany({
          where: {
            userId: req.user.userId,
            id: { not: req.params.id },
          },
          data: { isDefault: false },
        });
        updateData.isDefault = true;
      }

      const address = await prisma.address.update({
        where: { id: req.params.id },
        data: updateData,
      });

      res.json({
        message: 'Address updated successfully',
        address,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Address not found' });
      }
      console.error('Update address error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete address
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const address = await prisma.address.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await prisma.address.delete({
      where: { id: req.params.id },
    });

    // If deleted address was default, set first address as default
    const remainingAddresses = await prisma.address.findMany({
      where: { userId: req.user.userId },
    });

    if (remainingAddresses.length > 0 && !remainingAddresses.some(a => a.isDefault)) {
      await prisma.address.update({
        where: { id: remainingAddresses[0].id },
        data: { isDefault: true },
      });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Address not found' });
    }
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Set default address
router.patch('/:id/default', authenticateToken, async (req, res) => {
  try {
    const address = await prisma.address.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Unset all other defaults
    await prisma.address.updateMany({
      where: {
        userId: req.user.userId,
        id: { not: req.params.id },
      },
      data: { isDefault: false },
    });

    // Set this as default
    const updatedAddress = await prisma.address.update({
      where: { id: req.params.id },
      data: { isDefault: true },
    });

    res.json({
      message: 'Default address updated',
      address: updatedAddress,
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

