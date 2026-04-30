import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult, query } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Validate coupon
router.post('/validate',
  [body('code').trim().notEmpty(), body('orderTotal').isFloat({ min: 0 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { code, orderTotal } = req.body;

      const coupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (!coupon) {
        return res.json({
          valid: false,
          error: 'Invalid coupon code',
        });
      }

      if (!coupon.isActive) {
        return res.json({
          valid: false,
          error: 'This coupon is no longer active',
        });
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return res.json({
          valid: false,
          error: 'This coupon has expired',
        });
      }

      if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
        return res.json({
          valid: false,
          error: `Minimum order amount of $${coupon.minOrderAmount} required`,
        });
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return res.json({
          valid: false,
          error: 'This coupon has reached its usage limit',
        });
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = (orderTotal * coupon.discountValue) / 100;
      } else {
        discount = Math.min(coupon.discountValue, orderTotal);
      }

      res.json({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        },
        discount: Math.round(discount * 100) / 100,
      });
    } catch (error) {
      console.error('Validate coupon error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all coupons (admin only - add admin check later)
router.get('/', async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({ coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create coupon (admin only)
router.post('/',
  [
    body('code').trim().notEmpty(),
    body('discountType').isIn(['percentage', 'fixed']),
    body('discountValue').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const coupon = await prisma.coupon.create({
        data: {
          ...req.body,
          code: req.body.code.toUpperCase(),
        },
      });

      res.status(201).json({
        message: 'Coupon created successfully',
        coupon,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      console.error('Create coupon error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;

