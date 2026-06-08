import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MOCK_ARTICLES } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

const MARKETS = [
  { name: "S&P 500", value: "5,234.18", change: "+1.2%", up: true },
  { name: "DOW", value: "39,456.21", change: "+0.8%", up: true },
  { name: "NASDAQ", value: "16,345.92", change: "-0.3%", up: false },
  { name: "FTSE 100", value: "7,932.14", change: "+0.5%", up: true },
];

export function BusinessMarkets() {
  const articles = MOCK_ARTICLES.slice(1, 5);

  return (
    <section className="w-full py-12 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-editorial text-4xl font-bold text-foreground mb-8">Business & Markets</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Market Ticker Sidebar */}
          <div className="lg:col-span-1 border border-border p-6 bg-muted/30">
            <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Market Overview</h3>
            <div className="flex flex-col gap-4">
              {MARKETS.map((market) => (
                <div key={market.name} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                  <span className="font-body font-bold text-sm">{market.name}</span>
                  <div className="text-right">
                    <div className="font-body text-sm">{market.value}</div>
                    <div className={`flex items-center text-xs font-bold ${market.up ? 'text-green-600' : 'text-red-600'}`}>
                      {market.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {market.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Stories */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {articles.map((article, i) => (
                <div key={`biz-${i}`} className="flex flex-col border-b border-border pb-6 last:border-0 last:pb-0 md:border-0 md:pb-0 md:border-r md:pr-8 md:last:border-r-0 md:last:pr-0">
                  <Link href={`/article/${article.id}`} className="group block">
                    <h4 className="font-editorial text-2xl font-bold leading-tight mb-3 group-hover:text-muted-foreground transition-colors">
                      {article.title}
                    </h4>
                    <p className="font-body text-sm text-muted-foreground line-clamp-3">
                      {article.summary}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
