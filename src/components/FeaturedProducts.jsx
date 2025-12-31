import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeInSection } from "@/components/FadeInSection";
import { Heart, ShoppingCart } from "lucide-react";

import productBunny from "@/assets/product-bunny.jpg";
import productBlanket from "@/assets/product-blanket.jpg";
import productFlowers from "@/assets/product-flowers.jpg";
import productBeanie from "@/assets/product-beanie.jpg";

const products = [
  {
    id: 1,
    name: "Sage Bunny Friend",
    category: "Amigurumi Toys",
    price: 45,
    image: productBunny,
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Striped Baby Blanket",
    category: "Baby Collection",
    price: 85,
    image: productBlanket,
    tag: "New",
  },
  {
    id: 3,
    name: "Forever Flower Bouquet",
    category: "Home Decor",
    price: 55,
    image: productFlowers,
    tag: "Popular",
  },
  {
    id: 4,
    name: "Cozy Pom Beanie",
    category: "Wearables",
    price: 35,
    image: productBeanie,
    tag: null,
  },
];

export const FeaturedProducts = () => {
  return (
    <section id="products" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-warm opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-3">
            Our Creations
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each piece is lovingly handcrafted with premium materials and attention to every detail.
            Browse our most beloved creations.
          </p>
        </FadeInSection>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <FadeInSection key={product.id} delay={index * 100}>
              <Card className="group overflow-hidden bg-card border-none">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Tag */}
                  {product.tag && (
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {product.tag}
                    </span>
                  )}

                  {/* Quick actions */}
                  <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Button variant="warm" size="icon" className="rounded-full">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="blush" size="icon" className="rounded-full">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-serif font-medium text-lg text-foreground mt-1 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold text-lg">
                      ${product.price}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={400} className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </FadeInSection>
      </div>
    </section>
  );
};
