import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeInSection } from "@/components/FadeInSection";
import { Header } from "@/components/Header";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <FadeInSection>
            <div className="w-20 h-20 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">Thank you for your order</p>
            <p className="text-sm text-muted-foreground mb-8">Order ID: #{orderId}</p>
          </FadeInSection>
          
          <FadeInSection delay={100}>
            <Card className="p-6 bg-card border-none mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blush-light flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">We're preparing your order</p>
                  <p className="text-sm text-muted-foreground">You'll receive an email confirmation shortly</p>
                </div>
              </div>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild><Link to="/profile">View My Orders <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              <Button variant="outline" asChild><Link to="/shop">Continue Shopping</Link></Button>
            </div>
          </FadeInSection>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
