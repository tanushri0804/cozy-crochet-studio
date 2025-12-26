import { FadeInSection } from "@/components/FadeInSection";
import { Heart, Clock, Leaf, Sparkles } from "lucide-react";

const reasons = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every single stitch is crafted with genuine care and attention. Your purchase supports a real person's passion and livelihood.",
    color: "text-primary bg-blush-light",
  },
  {
    icon: Clock,
    title: "Slow Fashion",
    description: "We believe in quality over quantity. Each piece takes time to create, ensuring it will last for years and become a cherished keepsake.",
    color: "text-sage bg-sage-light",
  },
  {
    icon: Leaf,
    title: "Sustainable Choice",
    description: "Handmade means less environmental impact. We use premium, eco-friendly materials that are gentle on our planet.",
    color: "text-warm-brown bg-soft-pink",
  },
  {
    icon: Sparkles,
    title: "Truly Unique",
    description: "No two handmade pieces are exactly alike. You're getting a one-of-a-kind creation that can't be found in any store.",
    color: "text-primary bg-blush-light",
  },
];

export const WhyHandmade = () => {
  return (
    <section id="why-handmade" className="py-24 relative">
      <div className="absolute inset-0 stitch-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-3">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-4">
            Why Handmade Matters
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            In a world of mass production, handmade items carry a special magic. 
            Here's why choosing handmade is a choice for quality, sustainability, and love.
          </p>
        </FadeInSection>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <FadeInSection key={reason.title} delay={index * 100}>
              <div className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-xl ${reason.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <reason.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
        
        {/* Quote */}
        <FadeInSection delay={400} className="mt-16 text-center">
          <blockquote className="max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl font-serif italic text-foreground/80">
              "Every stitch tells a story. Made slow. Made with love."
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-8 h-0.5 bg-primary rounded-full" />
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <div className="w-8 h-0.5 bg-primary rounded-full" />
            </div>
          </blockquote>
        </FadeInSection>
      </div>
    </section>
  );
};
