"use client";

import Link from "next/link";
import { useArticleFilter } from "@/lib/hooks/useArticles";
import { useCategories } from "@/lib/hooks/useCategories";

export function OpinionSection() {
  const { data: categories } = useCategories();
  const category = categories?.find(
    (c) => c.slug === "opinion" || c.name.toLowerCase() === "opinion"
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
          <h2 className="font-editorial text-4xl font-bold text-foreground">Opinion</h2>
          <Link href="/category/opinion" className="font-body text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
            More Opinion →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/article/${article.slug}`} className="group flex flex-col p-6 border border-border hover:border-primary/30 transition-colors">
              <span className="font-body text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {article.category.name}
              </span>
              <h3 className="font-editorial text-xl font-bold leading-snug mb-3 group-hover:text-muted-foreground transition-colors">
                {article.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground line-clamp-3 mt-auto">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
