"use client";

import Image from "next/image";
import Link from "next/link";
import { useArticleFilter } from "@/lib/hooks/useArticles";
import { useCategories } from "@/lib/hooks/useCategories";

export function TechAndAI() {
  const { data: categories } = useCategories();
  const category = categories?.find(
    (c) => c.slug === "technology" || c.name.toLowerCase() === "technology" || c.slug === "ai"
  );

  const { data } = useArticleFilter({
    categoryId: category?.id,
    status: "PUBLISHED",
    sortBy: "publishedAt",
    sortOrder: "desc",
    page: 1,
    limit: 4,
  });

  const articles = data?.articles || [];
  if (articles.length === 0) return null;

  return (
    <section className="w-full py-12 border-b border-border bg-muted/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-editorial text-4xl font-bold text-foreground">Tech &amp; AI</h2>
          <Link href="/category/technology" className="font-body text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
            More Tech →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/article/${article.slug}`} className="group flex flex-col">
              {article.featuredImage && (
                <div className="relative w-full aspect-video mb-3 bg-muted overflow-hidden">
                  <Image src={article.featuredImage} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
              <h3 className="font-editorial text-xl font-bold leading-snug mb-2 group-hover:text-muted-foreground transition-colors">
                {article.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground line-clamp-2 mt-auto">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
