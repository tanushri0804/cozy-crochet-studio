import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeInSection } from "@/components/FadeInSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Heart, ShoppingCart, Minus, Plus, ChevronLeft, Truck, Shield, Gift } from "lucide-react";
import { getProductById, categoryLabels, products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const product = id ? getProductById(id) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <FadeInSection>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
              <span>/</span>
              <Link 
                to={`/shop?category=${product.category}`} 
                className="hover:text-primary transition-colors"
              >
                {categoryLabels[product.category]}
              </Link>
              <span>/</span>
              <span className="text-foreground">
                {product.name}
              </span>
            </nav>
          </FadeInSection> /* Back Button */
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <FadeInSection className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-card">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
                {product.tag && (
                  <span className={`absolute top-6 left-6 text-sm font-medium px-4 py-2 rounded-full ${
                    product.tag === 'Sale' 
                      ? 'bg-destructive text-destructive-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {product.tag}
                  </span>
                )}
              </div>
              {/* Thumbnail Gallery */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </FadeInSection> /* Info */
            <FadeInSection delay={100} className="space-y-6">
              <div>
                <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
                  {categoryLabels[product.category]}
                </p>
                <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-semibold text-primary">
                    ${product.price}
                  </span> {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-destructive/10 text-destructive text-sm font-medium px-2 py-1 rounded-full">
                      Save ${product.originalPrice - product.price}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border rounded-full bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
              </div> /* Benefits */
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-5 h-5 text-sage" />
                  </div>
                  <p className="text-xs text-muted-foreground">Free shipping over $75</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blush-light flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-5 h-5 text-blush" />
                  </div>
                  <p className="text-xs text-muted-foreground">Handmade quality</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-soft-pink flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Gift wrapping available</p>
                </div>
              </div> /* Care Instructions */
              <Card className="p-6 bg-card border-none">
                <h3 className="font-serif font-medium text-lg mb-3">Care Instructions</h3>
                <p className="text-muted-foreground text-sm">
                  {product.careInstructions}
                </p>
              </Card>
            </FadeInSection>
          </div> /* Related Products */
          {relatedProducts.length > 0 && (
            <section>
              <FadeInSection className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  You May Also Like
                </h2>
              </FadeInSection>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <FadeInSection key={relatedProduct.id} delay={index * 50}>
                    <Card className="group overflow-hidden bg-card border-none">
                      <Link to={`/product/${relatedProduct.id}`}>
                        <div className="relative overflow-hidden">
                          <img
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-serif font-medium text-foreground group-hover:text-primary transition-colors">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-primary font-semibold mt-1">${relatedProduct.price}</p>
                        </div>
                      </Link>
                    </Card>
                  </FadeInSection>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
