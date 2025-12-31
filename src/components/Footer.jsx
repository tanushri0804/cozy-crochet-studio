import { Heart, Instagram, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blush-light/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-sage-light/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <Heart className="w-7 h-7 text-primary fill-primary/30" />
              <span className="font-serif text-xl font-semibold text-foreground">
                Cozy Stitches
              </span>
            </a>

            <p className="text-muted-foreground mb-6 max-w-sm">
              Handcrafted with love, one stitch at a time. Every creation is made
              with premium yarn and endless care to bring warmth into your home.
            </p>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>

              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a href="mailto:hello@cozystitches.com">
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Shop All", "Custom Orders", "About Me", "FAQ", "Shipping Info"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold text-foreground mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                hello@cozystitches.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Portland, Oregon
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe for updates
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button variant="blush" size="sm" className="rounded-full px-4">
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Cozy Stitches. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with{" "}
            <Heart className="w-4 h-4 text-primary fill-primary" /> and lots of
            yarn
          </p>
        </div>
      </div>
    </footer>
  );
};
