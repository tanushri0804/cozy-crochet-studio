import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Products
  const products = [
    // Bouquets
    {
      name: 'Forever Rose Bouquet',
      category: 'bouquets',
      price: 65,
      description: 'A stunning arrangement of handcrafted crochet roses that will never wilt. Perfect for gifting or home décor. Each petal is carefully crafted to mimic the delicate beauty of real roses.',
      careInstructions: 'Gently dust with a soft cloth. Keep away from direct sunlight to preserve colors. Spot clean with damp cloth if needed.',
      images: JSON.stringify(['/assets/product-flowers.jpg']),
      tag: 'Popular',
      inStock: true,
    },
    {
      name: 'Wildflower Garden Bundle',
      category: 'bouquets',
      price: 85,
      description: 'A whimsical collection of daisies, lavender, and baby\'s breath, all lovingly crocheted. Brings the charm of a meadow into your home.',
      careInstructions: 'Dust regularly. Store in a cool, dry place. Avoid crushing the petals.',
      images: JSON.stringify(['/assets/product-flowers.jpg']),
      tag: 'New',
      inStock: true,
    },
    {
      name: 'Sunflower Sunshine',
      category: 'bouquets',
      price: 55,
      description: 'Bright and cheerful sunflowers to brighten any room. Each sunflower features realistic textured centers and vibrant yellow petals.',
      careInstructions: 'Keep in a vase or display stand. Dust gently. Colors may fade in direct sunlight.',
      images: JSON.stringify(['/assets/product-flowers.jpg']),
      inStock: true,
    },
    // Scarves
    {
      name: 'Cozy Cloud Infinity Scarf',
      category: 'scarves',
      price: 48,
      description: 'Wrap yourself in cloud-like softness with this chunky infinity scarf. Made with premium yarn for ultimate coziness.',
      careInstructions: 'Hand wash in cold water. Lay flat to dry. Do not wring or twist.',
      images: JSON.stringify(['/assets/product-beanie.jpg']),
      tag: 'Bestseller',
      inStock: true,
    },
    {
      name: 'Sage Green Wrap',
      category: 'scarves',
      price: 52,
      description: 'An elegant wrap in our signature sage green. Versatile enough for casual or dressy occasions.',
      careInstructions: 'Hand wash cold. Reshape while damp. Store folded to prevent stretching.',
      images: JSON.stringify(['/assets/product-beanie.jpg']),
      inStock: true,
    },
    {
      name: 'Blush Lace Shawl',
      category: 'scarves',
      price: 68,
      originalPrice: 85,
      description: 'Delicate lace pattern in soft blush pink. Perfect for weddings, special occasions, or beautiful gift.',
      careInstructions: 'Dry clean recommended. If hand washing, use gentle detergent and lay flat.',
      images: JSON.stringify(['/assets/product-beanie.jpg']),
      tag: 'Sale',
      inStock: true,
    },
    // Keyrings
    {
      name: 'Mini Bunny Keychain',
      category: 'keyrings',
      price: 15,
      description: 'Adorable tiny bunny to keep your keys company. Handmade with love, each bunny has unique personality.',
      careInstructions: 'Spot clean only. Keep dry. Handle gently to prevent stretching.',
      images: JSON.stringify(['/assets/product-bunny.jpg']),
      tag: 'Bestseller',
      inStock: true,
    },
    {
      name: 'Heart Charm Keyring',
      category: 'keyrings',
      price: 12,
      description: 'A sweet heart charm to show someone you care. Available in multiple colors.',
      careInstructions: 'Spot clean. Keep away from water. Store in a dry place.',
      images: JSON.stringify(['/assets/product-bunny.jpg']),
      inStock: true,
    },
    {
      name: 'Tiny Flower Bunch',
      category: 'keyrings',
      price: 18,
      description: 'A miniature bouquet that goes everywhere with you. Features three tiny flowers in assorted colors.',
      careInstructions: 'Handle with care. Spot clean only. Avoid pulling on petals.',
      images: JSON.stringify(['/assets/product-flowers.jpg']),
      tag: 'New',
      inStock: true,
    },
    // Plushies
    {
      name: 'Sage Bunny Friend',
      category: 'plushies',
      price: 45,
      description: 'Our most beloved creation! This cuddly bunny is perfect for children and adults alike. Made with hypoallergenic materials.',
      careInstructions: 'Surface wash with damp cloth. Air dry completely. Safe for ages 3+.',
      images: JSON.stringify(['/assets/product-bunny.jpg']),
      tag: 'Bestseller',
      inStock: true,
    },
    {
      name: 'Sleepy Bear Cub',
      category: 'plushies',
      price: 52,
      description: 'A drowsy little bear ready for cuddles. Comes with a tiny removable nightcap. Perfect bedtime companion.',
      careInstructions: 'Surface wash only. Air dry. Remove nightcap before cleaning.',
      images: JSON.stringify(['/assets/product-bunny.jpg']),
      tag: 'Popular',
      inStock: true,
    },
    {
      name: 'Baby Elephant',
      category: 'plushies',
      price: 58,
      description: 'A gentle giant in miniature form. Features floppy ears and a sweet embroidered smile.',
      careInstructions: 'Gentle surface wash. Squeeze out excess water gently. Air dry completely.',
      images: JSON.stringify(['/assets/product-bunny.jpg']),
      inStock: true,
    },
    // Gifts
    {
      name: 'Striped Baby Blanket',
      category: 'gifts',
      price: 85,
      description: 'The perfect gift for new parents. Soft, warm, and made with baby-safe yarns in gentle pastel stripes.',
      careInstructions: 'Machine wash gentle cycle, cold. Tumble dry low. Use mild detergent.',
      images: JSON.stringify(['/assets/product-blanket.jpg']),
      tag: 'New',
      inStock: true,
    },
    {
      name: 'Cozy Gift Set',
      category: 'gifts',
      price: 95,
      description: 'A curated set including a beanie, matching scarf, and small plushie. Perfect for any occasion.',
      careInstructions: 'See individual items for care instructions. Gift box can be recycled.',
      images: JSON.stringify(['/assets/product-beanie.jpg', '/assets/product-blanket.jpg', '/assets/product-bunny.jpg']),
      tag: 'Popular',
      inStock: true,
    },
    {
      name: 'Tea Cozy & Mug Set',
      category: 'gifts',
      price: 42,
      description: 'Keep your tea warm in style with this handmade cozy, paired with a ceramic mug.',
      careInstructions: 'Hand wash the cozy. Mug is dishwasher safe.',
      images: JSON.stringify(['/assets/product-blanket.jpg']),
      inStock: true,
    },
    // Custom
    {
      name: 'Custom Pet Portrait',
      category: 'custom',
      price: 120,
      description: 'Send us a photo of your beloved pet and we\'ll create a one-of-a-kind crochet portrait. Processing time: 2-3 weeks.',
      careInstructions: 'Display in a frame or shadow box. Dust gently. Keep away from direct sunlight.',
      images: JSON.stringify(['/assets/product-bunny.jpg']),
      tag: 'Popular',
      inStock: true,
    },
    {
      name: 'Personalized Baby Blanket',
      category: 'custom',
      price: 110,
      description: 'A custom blanket with baby\'s name crocheted into the design. Choose colors and font style.',
      careInstructions: 'Machine wash gentle, cold. Lay flat to dry for best results.',
      images: JSON.stringify(['/assets/product-blanket.jpg']),
      inStock: true,
    },
    {
      name: 'Custom Amigurumi Character',
      category: 'custom',
      price: 85,
      description: 'We\'ll create any character you can dream up! Great for birthdays, anniversaries, or just because.',
      careInstructions: 'Surface clean only. Handle with care. Each piece is unique.',
      images: JSON.stringify(['/assets/product-bunny.jpg']),
      tag: 'New',
      inStock: true,
    },
  ];

  console.log('📦 Creating products...');
  for (const product of products) {
    // Check if product exists by name
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });
    
    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  // Seed Coupons
  const coupons = [
    {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 30,
      isActive: true,
    },
    {
      code: 'COZY20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 75,
      isActive: true,
    },
    {
      code: 'FREESHIP',
      discountType: 'fixed',
      discountValue: 8,
      minOrderAmount: 50,
      isActive: true,
    },
    {
      code: 'HANDMADE15',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 60,
      isActive: true,
    },
  ];

  console.log('🎫 Creating coupons...');
  for (const coupon of coupons) {
    // Check if coupon exists by code (code is unique)
    const existing = await prisma.coupon.findUnique({
      where: { code: coupon.code },
    });
    
    if (!existing) {
      await prisma.coupon.create({
        data: coupon,
      });
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

