import { HeroSection } from "@/components/HeroSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { AboutMaker } from "@/components/AboutMaker";
import { WhyHandmade } from "@/components/WhyHandmade";
import { CustomerLove } from "@/components/CustomerLove";
import { InstagramPreview } from "@/components/InstagramPreview";

const Index = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <AboutMaker />
      <WhyHandmade />
      <CustomerLove />
      <InstagramPreview />
    </>
  );
};

export default Index;
