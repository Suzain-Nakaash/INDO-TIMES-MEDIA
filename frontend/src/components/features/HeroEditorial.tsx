"use client";

import Image from "next/image";
import Link from "next/link";
import { usePublishedArticles } from "@/lib/hooks/useArticles";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function HeroSkeleton() {
  return (
    <section className="w-full py-8 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Skeleton className="w-full aspect-video mb-4" />
          <Skeleton className="h-12 w-3/4 mb-3" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="hidden lg:block lg:col-span-1" />
        <div className="lg:col-span-3 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroEditorial() {
  const { data, isLoading } = usePublishedArticles(1, 5);

  if (isLoading) return <HeroSkeleton />;

  const articles = data?.articles || [];
  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <section className="w-full py-8 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Hero Story */}
        <div className="lg:col-span-8 flex flex-col">
          <Link href={`/article/${mainArticle.slug}`} className="group block mb-4">
            {mainArticle.featuredImage && (
              <div className="relative w-full aspect-video sm:aspect-[16/9] mb-4 bg-muted overflow-hidden">
                <Image
                  src={mainArticle.featuredImage}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            )}
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 group-hover:text-muted-foreground transition-colors">
              {mainArticle.title}
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground mb-4">
              {mainArticle.summary}
            </p>
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-auto">
            <span className="text-primary">{mainArticle.category.name}</span>
            <span>•</span>
            <span>{formatDate(mainArticle.publishedAt)}</span>
          </div>
        </div>

        {/* Divider for Desktop */}
        <div className="hidden lg:block lg:col-span-1 relative">
          <Separator orientation="vertical" className="absolute left-1/2 -translate-x-1/2 h-full bg-border" />
        </div>

        <Separator className="lg:hidden my-4 bg-border" />

        {/* Right Column Secondary Stories */}
        <div className="lg:col-span-3 flex flex-col">
          {sideArticles.map((article) => (
            <div key={article.id} className="flex flex-col mb-6 pb-6 border-b border-border last:border-0 last:mb-0 last:pb-0">
              <Link href={`/article/${article.slug}`} className="group block">
                <h3 className="font-editorial text-xl font-bold leading-snug mb-2 group-hover:text-muted-foreground transition-colors">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.summary}
                </p>
              </Link>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-auto">
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
