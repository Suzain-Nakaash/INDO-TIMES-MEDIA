"use client";

import Image from "next/image";
import Link from "next/link";
import { useArticleFilter } from "@/lib/hooks/useArticles";
import { useCategories } from "@/lib/hooks/useCategories";

export function BusinessMarkets() {
  const { data: categories } = useCategories();
  const category = categories?.find(
    (c) => c.slug === "business" || c.name.toLowerCase() === "business"
  );

  const { data } = useArticleFilter({
    categoryId: category?.id,
    status: "PUBLISHED",
    sortBy: "publishedAt",
    sortOrder: "desc",
    page: 1,
    limit: 5,
  });

  const articles = data?.articles || [];
  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);

  return (
    <section className="w-full py-12 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-editorial text-4xl font-bold text-foreground">Business &amp; Markets</h2>
          <Link href="/category/business" className="font-body text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
            More Business →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feature */}
          <div className="lg:col-span-7">
            <Link href={`/article/${mainArticle.slug}`} className="group block">
              {mainArticle.featuredImage && (
                <div className="relative w-full aspect-[16/9] mb-4 bg-muted overflow-hidden">
                  <Image src={mainArticle.featuredImage} alt={mainArticle.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
              <h3 className="font-editorial text-3xl font-bold leading-tight mb-3 group-hover:text-muted-foreground transition-colors">
                {mainArticle.title}
              </h3>
              <p className="font-body text-base text-muted-foreground">{mainArticle.summary}</p>
            </Link>
          </div>

          {/* Side Stories */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {sideArticles.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`} className="group flex gap-4 items-start border-b border-border pb-4 last:border-0">
                {article.featuredImage && (
                  <div className="relative w-28 h-20 flex-shrink-0 bg-muted overflow-hidden">
                    <Image src={article.featuredImage} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-editorial text-lg font-bold leading-snug group-hover:text-muted-foreground transition-colors">
                    {article.title}
                  </h4>
                  <span className="font-body text-xs text-muted-foreground">{article.category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
