import { FadeInSection } from "@/components/FadeInSection";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Emily R.",
    location: "California",
    rating: 5,
    text: "The bunny I ordered for my daughter is absolutely perfect! You can tell so much love went into making it. The quality is amazing and it arrived beautifully packaged. We'll treasure it forever!",
    product: "Sage Bunny Friend",
  },
  {
    id: 2,
    name: "Jessica M.",
    location: "New York",
    rating: 5,
    text: "I ordered a custom blanket for my newborn nephew and couldn't be happier. Sarah was so communicative and the final product exceeded all expectations. Truly a work of art!",
    product: "Custom Baby Blanket",
  },
  {
    id: 3,
    name: "Amanda K.",
    location: "Texas",
    rating: 5,
    text: "The forever flowers are stunning! They look so real and I love that they'll never wilt. Perfect gift for my mom who loves flowers but travels often. She was thrilled!",
    product: "Forever Flower Bouquet",
  },
];

export const CustomerLove = () => {
  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-blush-light/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-3">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-4">
            Customer Love
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nothing makes us happier than seeing our creations bring joy to your homes. 
            Here's what our lovely customers have to say.
          </p>
        </FadeInSection>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <FadeInSection key={testimonial.id} delay={index * 100}>
              <Card className="h-full bg-card border-none relative overflow-hidden">
                {/* Quote icon */}
                <div className="absolute top-4 right-4 text-blush-light">
                  <Quote className="w-12 h-12 fill-current" />
                </div>
                
                <CardContent className="p-6 pt-8 flex flex-col h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                  
                  {/* Text */}
                  <p className="text-foreground/80 flex-grow mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author */}
                  <div className="border-t border-border/50 pt-4">
                    <p className="font-serif font-medium text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location} • {testimonial.product}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};
