import { TopUtilityBar } from "./TopUtilityBar";
import { Masthead } from "./Masthead";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="w-full bg-background flex flex-col relative">
      <TopUtilityBar />
      <div className="w-full bg-primary text-primary-foreground py-1.5 px-4 font-body text-xs font-bold uppercase tracking-widest text-center">
        Breaking News: Global Markets Rally Amid AI Breakthroughs
      </div>
      <Masthead />
      <Navigation />
    </header>
  );
}
