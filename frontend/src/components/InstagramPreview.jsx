import { FadeInSection } from "@/components/FadeInSection";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink } from "lucide-react";

import productBunny from "@/assets/product-bunny.jpg";
import productBlanket from "@/assets/product-blanket.jpg";
import productFlowers from "@/assets/product-flowers.jpg";
import productBeanie from "@/assets/product-beanie.jpg";
import heroImage from "@/assets/hero-crochet.jpg";
import makerPortrait from "@/assets/maker-portrait.jpg";

const instagramPosts = [
  { id: 1, image: productBunny, likes: 234 },
  { id: 2, image: productBlanket, likes: 189 },
  { id: 3, image: productFlowers, likes: 312 },
  { id: 4, image: productBeanie, likes: 156 },
  { id: 5, image: heroImage, likes: 423 },
  { id: 6, image: makerPortrait, likes: 287 },
];

export const InstagramPreview = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <FadeInSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blush-light to-soft-pink px-6 py-3 rounded-full mb-6">
            <Instagram className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">@cozystitches</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
            Follow Our Journey
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Join our community on Instagram for behind-the-scenes peeks,
            new releases, and daily doses of cozy inspiration.
          </p>
        </FadeInSection>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post, index) => (
            <FadeInSection key={post.id} delay={index * 50}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square rounded-xl overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300"
              >
                <img
                  src={post.image}
                  alt={`Instagram post ${post.id}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary-foreground flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </a>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={300} className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5" />
              Follow on Instagram
            </a>
          </Button>
        </FadeInSection>
      </div>
    </section>
  );
};
