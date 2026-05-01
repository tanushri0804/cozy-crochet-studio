import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeInSection } from "@/components/FadeInSection";
import { Header } from "@/components/Header";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item) => {
    addToCart(item.product);
    toast({
      title: "Added to Cart",
      description: `${item.product.name} has been added to your cart`,
    });
  };

  const handleRemove = async (productId, productName) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Loading your wishlist...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeInSection>
            <div className="flex items-center gap-3 mb-8">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="font-serif text-3xl md:text-4xl font-medium">My Wishlist</h1>
              <span className="text-muted-foreground">({wishlist.length} items)</span>
            </div>
          </FadeInSection>

          {wishlist.length === 0 ? (
            <FadeInSection delay={100}>
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-serif text-xl mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start adding items you love to your wishlist!
                </p>
                <Button asChild size="lg">
                  <Link to="/shop">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </FadeInSection>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item, index) => (
                <FadeInSection key={item.id} delay={index * 100}>
                  <Card className="group overflow-hidden bg-card border-none h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <Link to={`/product/${item.product.id}`}>
                        <img
                          src={item.product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                          alt={item.product.name}
                          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                      
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(item.productId, item.product.name)}
                        className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Add to cart button */}
                      <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          className="w-full"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {item.product.category}
                      </span>
                      <Link 
                        to={`/product/${item.product.id}`}
                        className="font-serif font-medium text-lg text-foreground mt-1 mb-2 hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-primary font-semibold text-lg">
                          ${item.product.price}
                        </span>
                        {item.product.originalPrice && (
                          <span className="text-muted-foreground line-through text-sm">
                            ${item.product.originalPrice}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
