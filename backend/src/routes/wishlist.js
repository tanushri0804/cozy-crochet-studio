import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: req.user.userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse product images from JSON string
    const parsedWishlist = wishlistItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        images: item.product.images ? JSON.parse(item.product.images) : [],
      },
    }));

    res.json({ wishlist: parsedWishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Failed to get wishlist' });
  }
});

// Add to wishlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: req.user.userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    // Parse images for response
    const parsedItem = {
      ...wishlistItem,
      product: {
        ...wishlistItem.product,
        images: wishlistItem.product.images ? JSON.parse(wishlistItem.product.images) : [],
      },
    };

    res.status(201).json({
      message: 'Added to wishlist',
      item: parsedItem,
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    await prisma.wishlist.deleteMany({
      where: {
        userId: req.user.userId,
        productId,
      },
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const item = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId,
        },
      },
    });

    res.json({ isInWishlist: !!item });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ message: 'Failed to check wishlist' });
  }
});

export default router;
