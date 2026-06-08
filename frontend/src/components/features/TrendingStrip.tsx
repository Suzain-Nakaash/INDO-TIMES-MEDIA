import Link from "next/link";
import { MOCK_ARTICLES } from "@/lib/data";

export function TrendingStrip() {
  const trendingArticles = MOCK_ARTICLES.slice(0, 5);

  return (
    <section className="w-full bg-background border-b border-border py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div className="flex-shrink-0 bg-primary text-primary-foreground font-body text-xs font-bold uppercase tracking-widest px-3 py-1 mr-6">
          Trending
        </div>
        
        {/* Horizontal Scrolling Area */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex space-x-8 w-max">
            {trendingArticles.map((article, index) => (
              <div key={article.id} className="flex items-center gap-3">
                <span className="font-editorial text-2xl font-bold text-muted-foreground/30">
                  {index + 1}
                </span>
                <Link href={`/article/${article.id}`} className="group max-w-xs">
                  <h4 className="font-body text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
