import Image from "next/image";
import Link from "next/link";
import { MOCK_ARTICLES } from "@/lib/data";

export function PoliticsMagazine() {
  const articles = MOCK_ARTICLES.slice(0, 4);

  return (
    <section className="w-full py-16 bg-[#faf9f5] border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center mb-12">
          <h2 className="font-editorial text-5xl font-bold text-foreground text-center italic">
            Politics & Policy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {articles.map((article, index) => (
            <div key={`pol-${index}`} className="flex flex-col group cursor-pointer">
              <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden shadow-lg">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-2 py-1 bg-white text-black font-body text-[10px] font-bold uppercase tracking-widest mb-3">
                    {article.author}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold leading-tight text-white">
                    {article.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
