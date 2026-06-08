import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getCategory(slug: string) {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data || []).find((c: { slug: string }) => c.slug === slug) || null;
  } catch {
    return null;
  }
}

async function getArticles(categoryId: string, page = 1) {
  try {
    const res = await fetch(
      `${API_URL}/articles/filter?categoryId=${categoryId}&status=PUBLISHED&page=${page}&limit=12&sortBy=publishedAt&sortOrder=desc`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { articles: [], meta: null };
    const json = await res.json();
    return { articles: json.data || [], meta: json.meta?.pagination || null };
  } catch {
    return { articles: [], meta: null };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) {
    return { title: "Category | IndoTimesMedia" };
  }
  return {
    title: `${category.name} — IndoTimesMedia`,
    description: category.description || `Latest ${category.name} news from IndoTimesMedia`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const page = parseInt(pageParam || "1");
  const { articles, meta } = await getArticles(category.id, page);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Category Header */}
      <div className="w-full border-b-2 border-foreground py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-editorial text-5xl md:text-6xl font-bold text-foreground">
            {category.name}
          </h1>
          {category.description && (
            <p className="font-body text-lg text-muted-foreground mt-3">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <p className="font-body text-lg text-muted-foreground text-center py-20">
            No articles found in this category yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: {
                id: string;
                slug: string;
                title: string;
                summary: string | null;
                featuredImage: string | null;
                publishedAt: string | null;
                views: number;
                category: { name: string };
              }) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group flex flex-col border-b border-border pb-8"
                >
                  {article.featuredImage && (
                    <div className="relative w-full aspect-video mb-4 bg-muted overflow-hidden">
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h2 className="font-editorial text-2xl font-bold leading-tight mb-3 group-hover:text-muted-foreground transition-colors">
                    {article.title}
                  </h2>
                  {article.summary && (
                    <p className="font-body text-sm text-muted-foreground line-clamp-3 mb-3">
                      {article.summary}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-auto">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>•</span>
                    <span>{article.views} views</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                {meta.hasPrevPage && (
                  <Link
                    href={`/category/${slug}?page=${page - 1}`}
                    className="px-6 py-3 border-2 border-foreground font-body font-bold uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition-colors"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="font-body text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </span>
                {meta.hasNextPage && (
                  <Link
                    href={`/category/${slug}?page=${page + 1}`}
                    className="px-6 py-3 border-2 border-foreground font-body font-bold uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
