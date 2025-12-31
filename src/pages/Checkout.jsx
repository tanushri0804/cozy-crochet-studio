import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FadeInSection } from "@/components/FadeInSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, MapPin, CreditCard, Package } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, shipping, total, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated, addAddress, addOrder } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState('address');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/checkout');
    }
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, items, navigate]);

  useEffect(() => {
    if (user?.addresses.length) {
      const defaultAddr = user.addresses.find(a => a.isDefault);
      setSelectedAddressId(defaultAddr?.id || user.addresses[0].id);
    }
  }, [user]);

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.street || !newAddress.city) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    addAddress({ ...newAddress, isDefault: user?.addresses.length === 0 });
    setIsAddingAddress(false);
    setNewAddress({
      label: 'Home',
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    });
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    const selectedAddress = user?.addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress || !user) return;

    setTimeout(() => {
      const order = addOrder({
        userId: user.id,
        items: [...items],
        address: selectedAddress,
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        shipping,
        total,
        status: 'confirmed',
      });
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    }, 1500);
  };

  const selectedAddress = user?.addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInSection className="mb-8">
            <h1 className="text-3xl font-serif font-semibold text-foreground">Checkout</h1>

            <div className="flex items-center gap-4 mt-6">
              {[
                { key: 'address', label: 'Address', icon: MapPin },
                { key: 'payment', label: 'Payment', icon: CreditCard },
                { key: 'confirm', label: 'Confirm', icon: Package },
              ].map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === s.key
                        ? 'bg-primary text-primary-foreground'
                        : ['address', 'payment', 'confirm'].indexOf(step) > i
                        ? 'bg-sage text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {['address', 'payment', 'confirm'].indexOf(step) > i ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <s.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm hidden sm:inline">
                    {s.label}
                  </span>
                  {i < 2 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>
          </FadeInSection>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 'address' && (
                <Card className="p-6 bg-card border-none">
                  <h2 className="font-serif text-xl mb-4">Shipping Address</h2> {user?.addresses.length ? (
                    <RadioGroup
                      value={selectedAddressId}
                      onValueChange={setSelectedAddressId}
                      className="space-y-3">
                        {user.addresses.map((addr) => (
                        <div key={addr.id} className="flex items-start gap-3 p-4 rounded-xl bg-background">
                          <RadioGroupItem value={addr.id} id={addr.id} />
                          <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">
                              {addr.label}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {addr.fullName}, {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                            </p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <p className="text-muted-foreground">No saved addresses.</p>
                  )}

                  {isAddingAddress ? (
                    <div className="mt-4 p-4 bg-background rounded-xl space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Full Name *"
                          value={newAddress.fullName}
                          onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        />
                        <Input
                          placeholder="Phone"
                          value={newAddress.phone}
                          onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                        />
                      </div>

                      <Input
                        placeholder="Street Address *"
                        value={newAddress.street}
                          onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          placeholder="City *"
                          value={newAddress.city}
                          onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                        <Input
                          placeholder="State"
                          value={newAddress.state}
                          onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                        <Input
                          placeholder="ZIP"
                          value={newAddress.zipCode}
                          onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleAddAddress}>Save Address</Button>
                        <Button variant="ghost" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" className="mt-4" onClick={() => setIsAddingAddress(true)}>
                      + Add New Address
                    </Button>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setStep('payment')} disabled={!selectedAddressId}>
                      Continue to Payment
                    </Button>
                  </div>
                </Card>
              )}

              {step === 'payment' && (
                <Card className="p-6 bg-card border-none">
                  <h2 className="font-serif text-xl mb-4">Payment Method</h2>
                  <div className="p-4 bg-sage-light rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-2">This is a demo store</p>
                    <p className="font-medium">Cash on Delivery</p>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="ghost" onClick={() => setStep('address')}>Back</Button>
                    <Button onClick={() => setStep('confirm')}>Review Order</Button>
                  </div>
                </Card>
              )}

              {step === 'confirm' && (
                <Card className="p-6 bg-card border-none">
                  <h2 className="font-serif text-xl mb-4">Review Your Order</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-xl">
                      <p className="text-sm text-muted-foreground">Shipping to:</p>
                      <p className="font-medium">
                        {selectedAddress?.fullName}
                      </p>
                      <p className="text-sm">
                        {selectedAddress?.street}, {selectedAddress?.city}
                      </p>
                    </div>
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3 p-3 bg-background rounded-xl">
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="ghost" onClick={() => setStep('payment')}>Back</Button>
                    <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            <Card className="p-6 bg-card border-none h-fit">
              <h3 className="font-serif text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sage">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
