import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FadeInSection } from "@/components/FadeInSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Minus, Plus, Trash2, Tag, ShoppingBag, ArrowRight, X } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    appliedCoupon, 
    discount, 
    shipping, 
    total,
    applyCoupon,
    removeCoupon 
  } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    setCouponError('');
    const result = applyCoupon(couponCode);
    if (result.success) {
      setCouponCode('');
    } else {
      setCouponError(result.error || 'Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/auth?redirect=/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <FadeInSection className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-serif font-semibold text-foreground mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Explore our handmade treasures!
              </p>
              <Button size="lg" asChild>
                <Link to="/shop">
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </FadeInSection>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <FadeInSection className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-2">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </FadeInSection>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <FadeInSection key={item.product.id} delay={index * 50}>
                  <Card className="p-4 md:p-6 bg-card border-none">
                    <div className="flex gap-4">
                      <Link to={`/product/${item.product.id}`} className="shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
                        />
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <div>
                            <Link to={`/product/${item.product.id}`}>
                              <h3 className="font-serif font-medium text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              ${item.product.price} each
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border rounded-full bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <p className="font-semibold text-primary text-lg">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </FadeInSection>
              ))}
              
              <FadeInSection delay={items.length * 50}>
                <div className="flex justify-between items-center pt-4">
                  <Button variant="ghost" asChild>
                    <Link to="/shop">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </FadeInSection>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <FadeInSection delay={100}>
                <Card className="p-6 bg-card border-none sticky top-24">
                  <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>
                  
                  {/* Coupon Code */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Coupon Code</label>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-sage-light rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-sage" />
                          <span className="font-medium text-sm">{appliedCoupon.code}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={removeCoupon}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="bg-background"
                        />
                        <Button 
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-destructive text-sm mt-2">{couponError}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Try: WELCOME10, COZY20, or FREESHIP
                    </p>
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-sage">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-sage">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    
                    {subtotal < 75 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${(75 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    )}
                    
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      You'll need to sign in to complete your order
                    </p>
                  )}
                </Card>
              </FadeInSection>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
