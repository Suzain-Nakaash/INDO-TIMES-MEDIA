import Image from "next/image";
import Link from "next/link";
import { MOCK_ARTICLES } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export function HeroEditorial() {
  const mainArticle = MOCK_ARTICLES[0];
  const sideArticles = MOCK_ARTICLES.slice(1, 5);

  return (
    <section className="w-full py-8 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Hero Story (70% width on LG) */}
        <div className="lg:col-span-8 flex flex-col">
          <Link href={`/article/${mainArticle.id}`} className="group block mb-4">
            <div className="relative w-full aspect-video sm:aspect-[16/9] mb-4 bg-muted overflow-hidden">
              <Image
                src={mainArticle.imageUrl}
                alt={mainArticle.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 group-hover:text-muted-foreground transition-colors">
              {mainArticle.title}
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground mb-4">
              {mainArticle.summary}
            </p>
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-auto">
            <span className="text-primary">{mainArticle.category}</span>
            <span>•</span>
            <span>{mainArticle.author}</span>
            <span>•</span>
            <span>{mainArticle.publishedAt}</span>
          </div>
        </div>

        {/* Divider for Desktop */}
        <div className="hidden lg:block lg:col-span-1 relative">
          <Separator orientation="vertical" className="absolute left-1/2 -translate-x-1/2 h-full bg-border" />
        </div>

        <Separator className="lg:hidden my-4 bg-border" />

        {/* Right Column Secondary Stories (30% width on LG) */}
        <div className="lg:col-span-3 flex flex-col">
          {sideArticles.map((article, index) => (
            <div key={article.id} className="flex flex-col mb-6 pb-6 border-b border-border last:border-0 last:mb-0 last:pb-0">
              <Link href={`/article/${article.id}`} className="group block">
                <h3 className="font-editorial text-xl font-bold leading-snug mb-2 group-hover:text-muted-foreground transition-colors">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.summary}
                </p>
              </Link>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-auto">
                <span>{article.publishedAt}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
