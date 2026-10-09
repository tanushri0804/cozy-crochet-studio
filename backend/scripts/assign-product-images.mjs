import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imagesByName = {
  'Custom Amigurumi Character': '/products/custom-amigurumi.jpg',
  'Personalized Baby Blanket': '/products/personalized-baby-blanket.jpg',
  'Custom Pet Portrait': '/products/custom-pet-portrait.jpg',
  'Tea Cozy & Mug Set': '/products/tea-cozy-mug-set.jpg',
  'Cozy Gift Set': '/products/cozy-gift-set.jpg',
  'Baby Elephant': '/products/baby-elephant.jpg',
  'Sleepy Bear Cub': '/products/sleepy-bear-cub.jpg',
  'Tiny Flower Bunch': '/products/tiny-flower-bunch.jpg',
  'Heart Charm Keyring': '/products/heart-charm-keyring.jpg',
  'Mini Bunny Keychain': '/products/mini-bunny-keychain.jpg',
  'Blush Lace Shawl': '/products/blush-lace-shawl.jpg',
  'Sage Green Wrap': '/products/sage-green-wrap.jpg',
  'Cozy Cloud Infinity Scarf': '/products/cozy-cloud-infinity-scarf.jpg',
  'Sunflower Sunshine': '/products/sunflower-sunshine.jpg',
  'Wildflower Garden Bundle': '/products/wildflower-garden-bundle.jpg',
  'Forever Rose Bouquet': '/products/forever-rose-bouquet.jpg',
  'Bunny': '/products/bunny.jpg',
  'Cozy Pom Beanie': '/products/cozy-pom-beanie.jpg',
  'Forever Flower Bouquet': '/products/forever-flower-bouquet.jpg',
  'Striped Baby Blanket': '/products/striped-baby-blanket.jpg',
  'Sage Bunny Friend': '/products/sage-bunny-friend.jpg',
  'Wedding Ring Pillow': '/products/wedding-ring-pillow.jpg',
  'Custom Name Blanket': '/products/custom-name-blanket.jpg',
  'Baby Shower Gift Box': '/products/baby-shower-gift-box.jpg',
  'Birthday Gift Set': '/products/birthday-gift-set.jpg',
  'Baby Elephant Friend': '/products/baby-elephant-friend.jpg',
  'Sleepy Bear Plushie': '/products/sleepy-bear-plushie.jpg',
  'Flower Power Keyring': '/products/flower-power-keyring.jpg',
  'Cute Bunny Keyring': '/products/cute-bunny-keyring.jpg',
  'Rainbow Striped Scarf': '/products/rainbow-striped-scarf.jpg',
  'Cozy Winter Scarf': '/products/cozy-winter-scarf.jpg',
  'Tulip Garden Bouquet': '/products/tulip-garden-bouquet.jpg',
  'Rose Bouquet': '/products/rose-bouquet.jpg',
  'sunflower bouquet': '/products/sunflower-bouquet.jpg',
  'Crochet blanket': '/products/crochet-blanket.jpg',
};

const products = await prisma.product.findMany();
let updated = 0;
for (const product of products) {
  const image = imagesByName[product.name];
  if (!image) continue;
  await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify([image]) },
  });
  updated += 1;
}
console.log(`Updated ${updated} products`);
await prisma.$disconnect();
