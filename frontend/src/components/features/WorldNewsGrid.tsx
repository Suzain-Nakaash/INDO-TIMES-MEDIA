import Image from "next/image";
import Link from "next/link";
import { MOCK_ARTICLES } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export function WorldNewsGrid() {
  // Using mock data and repeating to fill the grid (1 large, 4 medium, 6 small)
  const largeFeature = MOCK_ARTICLES[1];
  const mediumStories = [...MOCK_ARTICLES, ...MOCK_ARTICLES].slice(2, 6);
  const smallStories = [...MOCK_ARTICLES, ...MOCK_ARTICLES, ...MOCK_ARTICLES].slice(0, 6);

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
          
          {/* 1 Large Feature (Left) */}
          <div className="lg:col-span-6 flex flex-col">
            <Link href={`/article/${largeFeature.id}`} className="group block mb-4">
              <div className="relative w-full aspect-[4/3] mb-4 bg-muted overflow-hidden">
                <Image
                  src={largeFeature.imageUrl}
                  alt={largeFeature.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-editorial text-3xl font-bold leading-tight mb-3 group-hover:text-muted-foreground transition-colors">
                {largeFeature.title}
              </h3>
              <p className="font-body text-base text-muted-foreground mb-4">
                {largeFeature.summary}
              </p>
            </Link>
          </div>

          {/* 4 Medium Stories (Middle Grid) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {mediumStories.map((story, i) => (
                <div key={`medium-${i}`} className="flex flex-col">
                  <Link href={`/article/${story.id}`} className="group block mb-2">
                    <div className="relative w-full aspect-video mb-3 bg-muted overflow-hidden">
                      <Image
                        src={story.imageUrl}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-editorial text-lg font-bold leading-snug group-hover:text-muted-foreground transition-colors">
                      {story.title}
                    </h4>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        {/* 6 Small Stories (Bottom Strip) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {smallStories.map((story, i) => (
            <div key={`small-${i}`} className="flex flex-col border-b border-border pb-4 lg:border-0 lg:pb-0">
              <Link href={`/article/${story.id}`} className="group block">
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

      </div>
    </section>
  );
}
