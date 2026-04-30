import { Button } from "@/components/ui/button";
import { FadeInSection } from "@/components/FadeInSection";
import heroImage from "@/assets/hero-crochet.jpg";
import { Heart, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative pt-2 pb-12 md:pt-4 md:pb-16 flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 stitch-pattern opacity-30 -z-10" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blush-light rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sage-light rounded-full blur-3xl opacity-40" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <FadeInSection className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blush-light/60 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Made with love & care
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground leading-tight mb-4">
              Handmade with love,{" "}
              <span className="text-primary italic">stitched with warmth</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-6 max-w-lg mx-auto lg:mx-0">
              Every stitch tells a story. Discover unique, handcrafted crochet
              creations made with premium yarn and endless love. Perfect for
              gifts that truly matter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="blush" size="xl">
                <ShoppingBagIcon />
                Shop Handmade
              </Button>
              <Button variant="outline" size="xl">
                <Heart className="w-5 h-5" />
                Custom Orders
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage" />
                <span>100% Handmade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Premium Yarn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blush" />
                <span>Made to Order</span>
              </div>
            </div>
          </FadeInSection>

          {/* Hero Image */}
          <FadeInSection delay={200} className="relative">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blush-light via-cream to-sage-light rounded-3xl rotate-2 opacity-60" />

              <div className="relative rounded-3xl overflow-hidden shadow-lifted">
                <img
                  src={heroImage}
                  alt="Adorable handmade crochet teddy bear in soft pastel colors"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />

                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-soft">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary fill-primary" />
                    <span className="font-medium text-foreground">
                      Made with love
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating yarn balls */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-blush rounded-full shadow-soft animate-float" />
              <div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-sage rounded-full shadow-soft animate-float"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

const ShoppingBagIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);
