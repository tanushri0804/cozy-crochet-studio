import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { AboutMaker } from "@/components/AboutMaker";
import { WhyHandmade } from "@/components/WhyHandmade";
import { CustomerLove } from "@/components/CustomerLove";
import { InstagramPreview } from "@/components/InstagramPreview";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <AboutMaker />
        <WhyHandmade />
        <CustomerLove />
        <InstagramPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
