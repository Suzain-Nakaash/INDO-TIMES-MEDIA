import Image from "next/image";
import Link from "next/link";
import { Share2, Link as LinkIcon, BookmarkPlus, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API_URL}/articles/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

async function getRelatedArticles(categoryId: string, excludeSlug: string) {
  try {
    const res = await fetch(
      `${API_URL}/articles/filter?categoryId=${categoryId}&status=PUBLISHED&limit=4&sortBy=publishedAt&sortOrder=desc`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).filter((a: { slug: string }) => a.slug !== excludeSlug).slice(0, 3);
  } catch {
    return [];
  }
}

async function getSeoMeta(slug: string) {
  try {
    const res = await fetch(`${API_URL}/seo/article/${slug}/meta`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getSeoMeta(slug);
  if (!seo) {
    return {
      title: "Article | IndoTimesMedia",
    };
  }
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.openGraph?.["og:title"] || seo.title,
      description: seo.openGraph?.["og:description"] || seo.description,
      url: seo.canonical,
      type: "article",
      images: seo.openGraph?.["og:image"] ? [seo.openGraph["og:image"]] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterCard?.["twitter:title"] || seo.title,
      description: seo.twitterCard?.["twitter:description"] || seo.description,
    },
    alternates: {
      canonical: seo.canonical,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedStories = await getRelatedArticles(article.categoryId, article.slug);
  const seo = await getSeoMeta(slug);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const wordCount = article.content?.split(/\s+/).length || 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return (
    <div className="w-full bg-background relative">
      {/* JSON-LD Structured Data */}
      {seo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLd) }}
        />
      )}

      <article className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto mb-10 text-center">
          <span className="font-body text-xs font-bold uppercase tracking-widest text-primary mb-4 block">
            {article.category?.name}
          </span>
          <h1 className="font-editorial text-4xl md:text-6xl font-bold leading-tight mb-6">
            {article.title}
          </h1>
          {article.summary && (
            <p className="font-body text-xl md:text-2xl text-muted-foreground mb-8">
              {article.summary}
            </p>
          )}
          
          <div className="flex flex-col md:flex-row items-center justify-between border-y border-border py-4">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full overflow-hidden relative grayscale bg-muted">
                <Image
                  src={`https://i.pravatar.cc/150?u=${article.id}`}
                  alt="Author"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left flex flex-col">
                <span className="font-body font-bold text-sm uppercase tracking-widest">IndoTimesMedia</span>
                <span className="font-body text-xs text-muted-foreground">
                  {formatDate(article.publishedAt)} • {readTime}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 border border-border hover:bg-muted transition-colors rounded-full"><Share2 className="w-4 h-4" /></button>
              <button className="p-2 border border-border hover:bg-muted transition-colors rounded-full"><LinkIcon className="w-4 h-4" /></button>
              <Separator orientation="vertical" className="h-8 mx-2" />
              <button className="p-2 border border-border hover:bg-muted transition-colors rounded-full"><BookmarkPlus className="w-4 h-4" /></button>
              <button className="p-2 border border-border hover:bg-muted transition-colors rounded-full"><MessageCircle className="w-4 h-4" /></button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {article.featuredImage && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="relative w-full aspect-video bg-muted mb-3">
              <Image src={article.featuredImage} alt={article.title} fill className="object-cover" priority />
            </div>
            <figcaption className="font-body text-xs text-muted-foreground">
              Photograph: IndoTimesMedia
            </figcaption>
          </div>
        )}

        {/* Article Body & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Main Content */}
          <div
            className="lg:col-span-8 font-body text-lg leading-relaxed text-foreground/90 prose prose-lg max-w-none prose-headings:font-editorial prose-headings:font-bold prose-blockquote:border-primary prose-blockquote:font-editorial prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 relative">
            <div className="sticky top-24">
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 border-b border-border pb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string) => (
                      <span key={tag} className="font-body text-xs px-3 py-1 bg-muted text-muted-foreground border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Stories */}
              {relatedStories.length > 0 && (
                <>
                  <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-2">
                    Related Stories
                  </h3>
                  
                  <div className="flex flex-col gap-6">
                    {relatedStories.map((story: { id: string; slug: string; title: string; publishedAt: string | null }) => (
                      <Link key={story.id} href={`/article/${story.slug}`} className="group flex flex-col">
                        <h4 className="font-editorial text-xl font-bold leading-tight mb-2 group-hover:text-muted-foreground transition-colors">
                          {story.title}
                        </h4>
                        <span className="font-body text-[10px] uppercase text-muted-foreground">
                          {formatDate(story.publishedAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Views counter */}
              <div className="mt-8 p-4 bg-muted/30 border border-border text-center">
                <span className="font-editorial text-3xl font-bold">{article.views?.toLocaleString() || 0}</span>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mt-1">Views</p>
              </div>
            </div>
          </aside>

        </div>
      </article>
    </div>
  );
}
