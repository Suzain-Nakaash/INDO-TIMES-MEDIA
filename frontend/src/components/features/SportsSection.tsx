import Image from "next/image";
import Link from "next/link";
import { MOCK_ARTICLES } from "@/lib/data";

export function SportsSection() {
  const articles = MOCK_ARTICLES.slice(0, 4);

  return (
    <section className="w-full py-12 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-editorial text-4xl font-bold text-foreground mb-8 uppercase tracking-widest border-b-4 border-foreground pb-2 inline-block">
          Sports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((article, i) => (
            <div key={`sport-${i}`} className="flex flex-col group relative overflow-hidden h-[400px]">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="font-body text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                  {article.category}
                </span>
                <Link href={`/article/${article.id}`}>
                  <h3 className="font-editorial text-xl font-bold leading-tight text-white group-hover:text-gray-300 transition-colors">
                    {article.title}
                  </h3>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
