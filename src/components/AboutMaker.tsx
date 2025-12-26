import { FadeInSection } from "@/components/FadeInSection";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import makerPortrait from "@/assets/maker-portrait.jpg";

export const AboutMaker = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sage-light/30 rounded-l-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <FadeInSection className="relative">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blush-light rounded-full blur-xl" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sage-light rounded-full blur-xl" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-lifted">
                <img
                  src={makerPortrait}
                  alt="Sarah, the maker behind Cozy Stitches"
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
              </div>
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-2xl shadow-lifted max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-serif font-medium">5+ Years</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  of creating handmade happiness
                </p>
              </div>
            </div>
          </FadeInSection>
          
          {/* Content */}
          <FadeInSection delay={200}>
            <div className="inline-flex items-center gap-2 bg-blush-light/60 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Meet the Maker</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-foreground mb-6">
              Hi, I'm Sarah!
            </h2>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg">
                My journey with crochet began in my grandmother's cozy living room, 
                where I learned that every stitch carries a piece of love.
              </p>
              
              <p>
                What started as a hobby has blossomed into a passion for creating 
                handmade treasures that bring joy to homes around the world. Each piece 
                I create is infused with care, patience, and the same warmth I felt 
                learning from my grandma.
              </p>
              
              <p>
                I believe in slow fashion, sustainable materials, and the magic 
                that happens when you pour your heart into creating something by hand. 
                Every order is more than just a product—it's a little piece of my heart 
                traveling to yours.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="text-center">
                <span className="block text-3xl font-serif font-semibold text-primary">500+</span>
                <span className="text-sm text-muted-foreground">Happy Customers</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-serif font-semibold text-sage">1000+</span>
                <span className="text-sm text-muted-foreground">Creations Made</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-serif font-semibold text-blush">100%</span>
                <span className="text-sm text-muted-foreground">Handmade Love</span>
              </div>
            </div>
            
            <Button variant="blush" size="lg" className="mt-8">
              <Heart className="w-5 h-5" />
              Let's Create Together
            </Button>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};
