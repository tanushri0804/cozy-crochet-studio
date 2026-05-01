import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  // Featured products from homepage
  {
    name: "Sage Bunny Friend",
    description: "Meet our adorable sage green bunny friend! Handcrafted with love using soft, premium yarn. This cute bunny features floppy ears, button eyes, and a little bow tie. Perfect for cuddles and makes a wonderful gift for all ages.",
    price: 45.00,
    category: "Plushies",
    images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop"],
    tag: "Bestseller",
    inStock: true,
    careInstructions: "Hand wash gently. Air dry only.",
  },
  {
    name: "Striped Baby Blanket",
    description: "Soft and cozy striped baby blanket in beautiful pink and cream colors. Made with the finest baby-safe yarn. Perfect for newborns and makes a thoughtful baby shower gift.",
    price: 85.00,
    category: "Custom Orders",
    images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop"],
    tag: "New",
    inStock: true,
    careInstructions: "Machine wash cold on gentle cycle. Tumble dry low.",
  },
  {
    name: "Forever Flower Bouquet",
    description: "A stunning everlasting flower bouquet featuring pink and cream roses with delicate greenery. Unlike real flowers, this crochet bouquet will last forever and makes a perfect centerpiece or gift.",
    price: 55.00,
    category: "Bouquets",
    images: ["https://images.unsplash.com/photo-1518882605630-8eb749176760?w=400&h=400&fit=crop"],
    tag: "Popular",
    inStock: true,
    careInstructions: "Dust gently. Keep away from direct sunlight.",
  },
  {
    name: "Cozy Pom Beanie",
    description: "Warm and stylish pom pom beanie in soft pink. Hand-crocheted with thick, cozy yarn to keep you warm all winter. The fluffy pom pom adds a playful touch!",
    price: 35.00,
    category: "Scarves",
    images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop"],
    inStock: true,
    careInstructions: "Hand wash cold. Reshape and lay flat to dry.",
  },
  {
    name: "Rose Bouquet",
    description: "Handcrafted crochet rose bouquet with 6 beautiful red roses, perfect for gifting on special occasions. Each rose is carefully made with soft yarn.",
    price: 45.00,
    originalPrice: 55.00,
    category: "Bouquets",
    images: ["https://images.unsplash.com/photo-1563241527-3004b7be0250?w=400&h=400&fit=crop"],
    tag: "Popular",
    inStock: true,
    careInstructions: "Keep away from water. Dust gently with soft cloth.",
  },
  {
    name: "Tulip Garden Bouquet",
    description: "Colorful crochet tulip arrangement featuring pink, yellow, and white tulips in a decorative vase.",
    price: 38.00,
    category: "Bouquets",
    images: ["https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=400&h=400&fit=crop"],
    tag: "New",
    inStock: true,
  },
  {
    name: "Cozy Winter Scarf",
    description: "Super soft hand-crocheted scarf in warm cream color. Perfect for chilly winter days.",
    price: 32.00,
    originalPrice: 40.00,
    category: "Scarves",
    images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1bf?w=400&h=400&fit=crop"],
    tag: "Sale",
    inStock: true,
    careInstructions: "Hand wash in cold water. Lay flat to dry.",
  },
  {
    name: "Rainbow Striped Scarf",
    description: "Vibrant rainbow-colored crochet scarf that adds a pop of color to any outfit.",
    price: 28.00,
    category: "Scarves",
    images: ["https://images.unsplash.com/photo-1609803384069-19fc89f5d7e0?w=400&h=400&fit=crop"],
    tag: "Bestseller",
    inStock: true,
  },
  {
    name: "Cute Bunny Keyring",
    description: "Adorable mini bunny keyring in soft pink. Perfect accessory for your keys or bag.",
    price: 12.00,
    category: "Keyrings",
    images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop"],
    tag: "Popular",
    inStock: true,
  },
  {
    name: "Flower Power Keyring",
    description: "Bright sunflower keyring that brings sunshine wherever you go.",
    price: 10.00,
    category: "Keyrings",
    images: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop"],
    tag: "New",
    inStock: true,
  },
  {
    name: "Sleepy Bear Plushie",
    description: "Huggable brown bear plushie that's perfect for cuddles. Soft, squishy, and oh-so-cute!",
    price: 35.00,
    originalPrice: 42.00,
    category: "Plushies",
    images: ["https://images.unsplash.com/photo-1559715544-33be62554fa6?w=400&h=400&fit=crop"],
    tag: "Popular",
    inStock: true,
  },
  {
    name: "Baby Elephant Friend",
    description: "Gentle blue elephant plushie with floppy ears. A perfect gift for little ones.",
    price: 38.00,
    category: "Plushies",
    images: ["https://images.unsplash.com/photo-1559454403-b8fb88021ada?w=400&h=400&fit=crop"],
    tag: "New",
    inStock: true,
    careInstructions: "Surface clean only with damp cloth.",
  },
  {
    name: "Birthday Gift Set",
    description: "Complete gift set including a crochet birthday cake decoration, mini banner, and gift card holder.",
    price: 25.00,
    category: "Gifts",
    images: ["https://images.unsplash.com/photo-1530103862676-de3c9a59aa38?w=400&h=400&fit=crop"],
    tag: "Bestseller",
    inStock: true,
  },
  {
    name: "Baby Shower Gift Box",
    description: "Adorable baby shower gift set with mini booties, tiny hat, and rattle toy.",
    price: 48.00,
    originalPrice: 60.00,
    category: "Gifts",
    images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop"],
    tag: "Popular",
    inStock: true,
  },
  {
    name: "Custom Name Blanket",
    description: "Personalized baby blanket with custom name crocheted in. Choose your colors!",
    price: 65.00,
    category: "Custom Orders",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    inStock: true,
  },
  {
    name: "Wedding Ring Pillow",
    description: "Elegant white and lace crochet pillow for wedding rings. Can be customized with initials.",
    price: 30.00,
    category: "Custom Orders",
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop"],
    tag: "New",
    inStock: true,
  },
];

async function seedProducts() {
  console.log('🌱 Seeding products...');
  
  try {
    // Count existing products
    const existingCount = await prisma.product.count();
    console.log(`� Found ${existingCount} existing products`);
    
    // Create products (skip if already exists with same name)
    let createdCount = 0;
    for (const product of sampleProducts) {
      const existing = await prisma.product.findFirst({
        where: { name: product.name }
      });
      
      if (existing) {
        console.log(`⏭️  Skipped: ${product.name} (already exists)`);
        continue;
      }
      
      const created = await prisma.product.create({
        data: {
          ...product,
          images: JSON.stringify(product.images),
        },
      });
      console.log(`✅ Created: ${created.name} (${created.category})`);
      createdCount++;
    }
    
    console.log(`\n🎉 Successfully added ${createdCount} new products!`);
    console.log('\n📊 Categories breakdown:');
    const categories = {};
    sampleProducts.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
