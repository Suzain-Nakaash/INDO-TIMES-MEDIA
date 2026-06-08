import { HeroEditorial } from "@/components/features/HeroEditorial";
import { TrendingStrip } from "@/components/features/TrendingStrip";
import { WorldNewsGrid } from "@/components/features/WorldNewsGrid";
import { PoliticsMagazine } from "@/components/features/PoliticsMagazine";
import { BusinessMarkets } from "@/components/features/BusinessMarkets";
import { TechAndAI } from "@/components/features/TechAndAI";
import { SportsSection } from "@/components/features/SportsSection";
import { OpinionSection } from "@/components/features/OpinionSection";
import { NewsletterSection } from "@/components/features/NewsletterSection";

export default function Home() {
  return (
    <>
      <TrendingStrip />
      <HeroEditorial />
      <WorldNewsGrid />
      <PoliticsMagazine />
      <BusinessMarkets />
      <TechAndAI />
      <SportsSection />
      <OpinionSection />
      <NewsletterSection />
    </>
  );
}
