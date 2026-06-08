import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Article } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "hero" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-4">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="mb-2 w-fit text-[10px] uppercase">
            {article.category.name}
          </Badge>
          <h3 className="font-heading text-sm font-bold leading-tight group-hover:text-primary">
            {article.title}
          </h3>
          <span className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Card className={`group overflow-hidden border-none shadow-none bg-transparent ${isHero ? "" : ""}`}>
      <Link href={`/news/${article.slug}`}>
        <div className={`relative w-full overflow-hidden rounded-xl ${isHero ? "h-[400px] md:h-[500px]" : "h-48 md:h-56"}`}>
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isHero && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          )}
        </div>
        <CardContent className={`p-0 ${isHero ? "absolute bottom-0 left-0 right-0 p-6 text-white" : "mt-4"}`}>
          <Badge variant={isHero ? "default" : "secondary"} className={`mb-3 uppercase ${isHero ? "bg-secondary text-white" : ""}`}>
            {article.category.name}
          </Badge>
          <h3 className={`font-heading font-bold leading-tight ${isHero ? "text-2xl md:text-4xl text-white drop-shadow-md" : "text-xl group-hover:text-primary transition-colors"}`}>
            {article.title}
          </h3>
          {(!isHero || true) && (
            <p className={`mt-2 line-clamp-2 ${isHero ? "text-white/80" : "text-muted-foreground"}`}>
              {article.excerpt}
            </p>
          )}
          <div className={`mt-4 flex items-center gap-2 text-sm ${isHero ? "text-white/80" : "text-muted-foreground"}`}>
            <span className="font-medium text-foreground dark:text-white">{article.author.name}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
