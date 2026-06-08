"use client";

import Image from "next/image";
import Link from "next/link";
import { useArticleFilter } from "@/lib/hooks/useArticles";
import { useCategories } from "@/lib/hooks/useCategories";
import { Separator } from "@/components/ui/separator";

export function WorldNewsGrid() {
  const { data: categories } = useCategories();
  const worldCategory = categories?.find(
    (c) => c.slug === "world" || c.name.toLowerCase() === "world"
  );
  
  const { data } = useArticleFilter({
    categoryId: worldCategory?.id,
    status: "PUBLISHED",
    sortBy: "publishedAt",
    sortOrder: "desc",
    page: 1,
    limit: 11,
  });

  const articles = data?.articles || [];
  if (articles.length === 0) return null;

  const largeFeature = articles[0];
  const mediumStories = articles.slice(1, 5);
  const smallStories = articles.slice(5, 11);

  return (
    <section className="w-full py-12 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-editorial text-4xl font-bold text-foreground">World News</h2>
          <Link href="/category/world" className="font-body text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
            See All World News →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 1 Large Feature */}
          <div className="lg:col-span-6 flex flex-col">
            <Link href={`/article/${largeFeature.slug}`} className="group block mb-4">
              {largeFeature.featuredImage && (
                <div className="relative w-full aspect-[4/3] mb-4 bg-muted overflow-hidden">
                  <Image
                    src={largeFeature.featuredImage}
                    alt={largeFeature.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <h3 className="font-editorial text-3xl font-bold leading-tight mb-3 group-hover:text-muted-foreground transition-colors">
                {largeFeature.title}
              </h3>
              <p className="font-body text-base text-muted-foreground mb-4">
                {largeFeature.summary}
              </p>
            </Link>
          </div>

          {/* 4 Medium Stories */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {mediumStories.map((story) => (
                <div key={story.id} className="flex flex-col">
                  <Link href={`/article/${story.slug}`} className="group block mb-2">
                    {story.featuredImage && (
                      <div className="relative w-full aspect-video mb-3 bg-muted overflow-hidden">
                        <Image
                          src={story.featuredImage}
                          alt={story.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h4 className="font-editorial text-lg font-bold leading-snug group-hover:text-muted-foreground transition-colors">
                      {story.title}
                    </h4>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {smallStories.length > 0 && (
          <>
            <Separator className="my-8 bg-border" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {smallStories.map((story) => (
                <div key={story.id} className="flex flex-col border-b border-border pb-4 lg:border-0 lg:pb-0">
                  <Link href={`/article/${story.slug}`} className="group block">
                    <h5 className="font-editorial text-base font-bold leading-snug mb-2 group-hover:text-muted-foreground transition-colors">
                      {story.title}
                    </h5>
                    <p className="font-body text-xs text-muted-foreground line-clamp-3">
                      {story.summary}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
