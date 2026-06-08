"use client";

import { TopUtilityBar } from "./TopUtilityBar";
import { Masthead } from "./Masthead";
import { Navigation } from "./Navigation";
import { usePublishedArticles } from "@/lib/hooks/useArticles";

export function Header() {
  const { data } = usePublishedArticles(1, 1);
  const latestArticle = data?.articles?.[0];
  const breakingText = latestArticle
    ? `Breaking News: ${latestArticle.title}`
    : "Breaking News: Stay Updated with IndoTimesMedia";

  return (
    <header className="w-full bg-background flex flex-col relative">
      <TopUtilityBar />
      <div className="w-full bg-primary text-primary-foreground py-1.5 px-4 font-body text-xs font-bold uppercase tracking-widest text-center truncate">
        {breakingText}
      </div>
      <Masthead />
      <Navigation />
    </header>
  );
}
