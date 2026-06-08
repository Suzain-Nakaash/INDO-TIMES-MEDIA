import Image from "next/image";
import Link from "next/link";
import { MOCK_ARTICLES } from "@/lib/data";

export function OpinionSection() {
  const articles = MOCK_ARTICLES.slice(2, 6);

  return (
    <section className="w-full py-16 bg-[#f7f5f0] border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-editorial text-4xl font-bold text-foreground italic">Opinion & Editorial</h2>
          <Link href="/category/opinion" className="font-body text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
            All Opinions →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
          {articles.map((article, i) => (
            <div key={`op-${i}`} className="flex flex-col border-t border-foreground pt-6">
              <Link href={`/article/${article.id}`} className="group block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted relative grayscale">
                    <Image
                      src={`https://i.pravatar.cc/150?u=${article.author}`}
                      alt={article.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body text-xs font-bold uppercase tracking-wider">{article.author}</span>
                    <span className="font-body text-[10px] text-muted-foreground uppercase">{article.publishedAt}</span>
                  </div>
                </div>
                <h3 className="font-editorial text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
