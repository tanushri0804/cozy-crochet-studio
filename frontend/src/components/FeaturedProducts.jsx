import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeInSection } from "@/components/FadeInSection";
import { Heart, ShoppingCart } from "lucide-react";
import { productsAPI } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        // Get first 4 products as featured
        setProducts((data.products || []).slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Parse images helper
  const getImageUrl = (product) => {
    try {
      if (product.images) {
        if (typeof product.images === "string") {
          return JSON.parse(product.images)[0];
        } else if (Array.isArray(product.images)) {
          return product.images[0];
        }
      }
    } catch (e) {}
    return "https://via.placeholder.com/400x400?text=No+Image";
  };

  if (loading) {
    return (
      <section id="products" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-warm opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading featured products...</p>
        </div>
      </section>
    );
  }
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
                    src={getImageUrl(product)}
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
                    <Button 
                      variant="warm" 
                      size="icon" 
                      className={`rounded-full ${isInWishlist(product.id) ? 'bg-rose-500 text-white hover:bg-rose-600' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      variant="blush" 
                      size="icon" 
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                        toast({
                          title: "Added to Cart",
                          description: `${product.name} has been added to your cart`,
                        });
                      }}
                    >
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
                      asChild
                    >
                      <Link to={`/product/${product.id}`}>View Details</Link>
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
