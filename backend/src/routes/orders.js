import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: {
        address: true,
        coupon: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      include: {
        address: true,
        coupon: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/',
  authenticateToken,
  [
    body('addressId').notEmpty(),
    body('items').isArray({ min: 1 }),
    body('items.*.productId').notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('subtotal').isFloat({ min: 0 }),
    body('total').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        addressId,
        items,
        subtotal,
        discount = 0,
        shipping = 0,
        total,
        couponCode,
      } = req.body;

      // Verify address belongs to user
      const address = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId: req.user.userId,
        },
      });

      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }

      // Get coupon if provided
      let coupon = null;
      let couponId = null;
      if (couponCode) {
        coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() },
        });
        if (coupon && coupon.isActive) {
          couponId = coupon.id;
          // Increment used count
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      // Verify all products exist and get their prices
      const productIds = items.map(item => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        return res.status(400).json({ message: 'Some products not found' });
      }

      // Create order with items
      const order = await prisma.order.create({
        data: {
          userId: req.user.userId,
          addressId,
          couponId,
          subtotal,
          discount,
          shipping,
          total,
          couponCode: couponCode?.toUpperCase(),
          status: 'confirmed',
          items: {
            create: items.map(item => {
              const product = products.find(p => p.id === item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: {
          address: true,
          coupon: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      res.status(201).json({
        message: 'Order created successfully',
        order,
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all orders (admin only)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, userId } = req.query;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    if (userId) {
      where.userId = userId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        address: true,
        coupon: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order statistics (admin only)
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
    });
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      ordersByStatus,
      recentOrders,
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin,
  [body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await prisma.order.findFirst({
        where: {
          id: req.params.id,
          userId: req.user.userId,
        },
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: req.body.status },
        include: {
          address: true,
          coupon: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      res.json({
        message: 'Order status updated',
        order: updatedOrder,
      });
    } catch (error) {
      console.error('Update order error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;

