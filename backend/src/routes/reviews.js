import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const [reviews, total, avgRating] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.review.count({
        where: { productId },
      }),
      prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
      }),
    ]);

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: { rating: true },
    });

    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      const item = ratingDistribution.find(r => r.rating === i);
      distribution[i] = item ? item._count.rating : 0;
    }

    res.json({
      reviews,
      total,
      averageRating: avgRating._avg.rating || 0,
      ratingDistribution: distribution,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Failed to get reviews' });
  }
});

// Create a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'Product ID, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: req.user.userId,
        productId,
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.userId,
        productId,
        rating: parseInt(rating),
        title: title || null,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
});

// Update a review
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ? parseInt(rating) : existingReview.rating,
        title: title !== undefined ? title : existingReview.title,
        comment: comment || existingReview.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

// Delete a review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await prisma.review.delete({
      where: { id },
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

// Get user's reviews
router.get('/my-reviews', authenticateToken, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse product images
    const parsedReviews = reviews.map(review => ({
      ...review,
      product: {
        ...review.product,
        images: review.product.images ? JSON.parse(review.product.images) : [],
      },
    }));

    res.json({ reviews: parsedReviews });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Failed to get reviews' });
  }
});

// Check if user can review (has purchased the product)
router.get('/can-review/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if user has an order with this product
    const hasOrdered = await prisma.order.findFirst({
      where: {
        userId: req.user.userId,
        status: { in: ['delivered', 'shipped'] },
        items: {
          some: {
            productId,
          },
        },
      },
    });

    // Check if user already reviewed
    const hasReviewed = await prisma.review.findFirst({
      where: {
        userId: req.user.userId,
        productId,
      },
    });

    res.json({
      canReview: !!hasOrdered && !hasReviewed,
      hasOrdered: !!hasOrdered,
      hasReviewed: !!hasReviewed,
    });
  } catch (error) {
    console.error('Check can review error:', error);
    res.status(500).json({ message: 'Failed to check review eligibility' });
  }
});

export default router;
