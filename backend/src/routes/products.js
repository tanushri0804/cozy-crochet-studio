import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult, query } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, inStock } = req.query;
    
    const where = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (search) {
      // SQLite doesn't support case-insensitive mode, so we'll use contains
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    
    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Parse images JSON string to array
    const productsWithParsedImages = products.map(product => ({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
    }));

    res.json({ products: productsWithParsedImages });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Parse images JSON string to array
    const productWithParsedImages = {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
    };

    res.json({ product: productWithParsedImages });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/',
  authenticateToken,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('description').trim().notEmpty(),
    body('images').isArray({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Convert images array to JSON string if it's an array
      const productData = {
        ...req.body,
        images: Array.isArray(req.body.images) 
          ? JSON.stringify(req.body.images) 
          : req.body.images,
        originalPrice: req.body.originalPrice || null,
        careInstructions: req.body.careInstructions || null,
        tag: req.body.tag || null,
        inStock: req.body.inStock !== undefined ? req.body.inStock : true,
        materials: req.body.materials || null,
        weight: req.body.weight ? parseFloat(req.body.weight) : null,
        specifications: req.body.specifications || null,
        measurements: req.body.measurements || null,
      };

      const product = await prisma.product.create({
        data: productData,
      });

      // Parse images back to array for response
      const productWithParsedImages = {
        ...product,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
      };

      res.status(201).json({
        message: 'Product created successfully',
        product: productWithParsedImages,
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update product (admin only)
router.put('/:id',
  authenticateToken,
  requireAdmin,
  [
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Convert images array to JSON string if it's an array
      const updateData = {
        ...req.body,
        images: Array.isArray(req.body.images) 
          ? JSON.stringify(req.body.images) 
          : (req.body.images || undefined),
      };

      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: updateData,
      });

      // Parse images back to array for response
      const productWithParsedImages = {
        ...product,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
      };

      res.json({
        message: 'Product updated successfully',
        product: productWithParsedImages,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Product not found' });
      }
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

