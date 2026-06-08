import Image from "next/image";
import Link from "next/link";
import { MOCK_ARTICLES } from "@/lib/data";

export function TechAndAI() {
  const articles = MOCK_ARTICLES.slice(0, 3);

  return (
    <section className="w-full py-12 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-editorial text-4xl font-bold text-foreground mb-8">Technology & AI</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <div key={`tech-${i}`} className="flex flex-col group">
              <Link href={`/article/${article.id}`} className="block mb-4 overflow-hidden border border-border p-1 bg-muted/10">
                <div className="relative w-full aspect-video bg-muted overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
              <span className="font-body text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                {article.category}
              </span>
              <Link href={`/article/${article.id}`}>
                <h3 className="font-editorial text-2xl font-bold leading-snug group-hover:text-muted-foreground transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-2">
                  {article.summary}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
