import Image from "next/image";
import Link from "next/link";
import { Share2, Link as LinkIcon, BookmarkPlus, MessageCircle } from "lucide-react";
import { MOCK_ARTICLES } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = MOCK_ARTICLES.find(a => a.id === params.slug) || MOCK_ARTICLES[0];
  const relatedStories = MOCK_ARTICLES.slice(1, 4);

  return (
    <div className="w-full bg-background relative">
      {/* Reading Progress Indicator (CSS-only or minimal approach) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div className="h-full bg-primary w-1/3" /> {/* Note: Real impl would use scroll listener */}
      </div>

      <article className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto mb-10 text-center">
          <span className="font-body text-xs font-bold uppercase tracking-widest text-primary mb-4 block">
            {article.category}
          </span>
          <h1 className="font-editorial text-4xl md:text-6xl font-bold leading-tight mb-6">
            {article.title}
          </h1>
          <p className="font-body text-xl md:text-2xl text-muted-foreground mb-8">
            {article.summary}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-between border-y border-border py-4">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full overflow-hidden relative grayscale">
                <Image src={`https://i.pravatar.cc/150?u=${article.author}`} alt={article.author} fill className="object-cover" />
              </div>
              <div className="text-left flex flex-col">
                <span className="font-body font-bold text-sm uppercase tracking-widest">{article.author}</span>
                <span className="font-body text-xs text-muted-foreground">{article.publishedAt} • {article.readTime}</span>
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
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative w-full aspect-video bg-muted mb-3">
            <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
          </div>
          <figcaption className="font-body text-xs text-muted-foreground">
            Photograph: IndoTimesMedia / Reuters
          </figcaption>
        </div>

        {/* Article Body & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Main Content */}
          <div className="lg:col-span-8 font-body text-lg leading-relaxed text-foreground/90">
            <p className="mb-6"><span className="float-left text-7xl font-editorial font-bold leading-none pr-2 pt-2">{article.summary.charAt(0)}</span>{article.summary.slice(1)} This is a longer demonstration of the article body text. It contains detailed insights, reports, and journalistic integrity.</p>
            
            <p className="mb-6">The global markets reacted positively to the sudden shift in policy. Experts suggest that the new frameworks will stabilize the region, but caution remains high. "We are looking at an unprecedented level of innovation," one analyst noted.</p>

            <blockquote className="my-10 pl-6 border-l-4 border-primary font-editorial text-2xl italic text-foreground">
              "This isn't just a breakthrough in technology; it's a fundamental restructuring of how our economy operates."
            </blockquote>

            <p className="mb-6">Regulators are scrambling. The old rules no longer apply. A new committee has been formed in Geneva to outline the basics of what they're calling 'The New Accord'.</p>

            <h3 className="font-editorial text-3xl font-bold mb-4 mt-8">The Path Forward</h3>
            
            <p className="mb-6">As we look to the next quarter, several key indicators suggest sustained growth. However, inflation remains a sticky issue in developing markets.</p>

            {/* Newsletter CTA Inside Article */}
            <div className="my-10 p-8 border-y-2 border-foreground bg-muted/20 text-center">
              <h4 className="font-editorial text-2xl font-bold mb-2">Want deeper insights?</h4>
              <p className="text-sm text-muted-foreground mb-4">Sign up for our premium newsletter.</p>
              <div className="flex max-w-sm mx-auto">
                <input type="email" placeholder="Email" className="flex-1 border border-border p-2 outline-none text-sm" />
                <button className="bg-foreground text-background px-4 py-2 font-bold uppercase tracking-widest text-xs">Subscribe</button>
              </div>
            </div>

            <p className="mb-6">More analysis will be provided as the situation develops. Our correspondents are on the ground in Geneva and New York.</p>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 relative">
            <div className="sticky top-24">
              <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-2">
                Related Stories
              </h3>
              
              <div className="flex flex-col gap-6">
                {relatedStories.map((story, i) => (
                  <Link key={i} href={`/article/${story.id}`} className="group flex flex-col">
                    <h4 className="font-editorial text-xl font-bold leading-tight mb-2 group-hover:text-muted-foreground transition-colors">
                      {story.title}
                    </h4>
                    <span className="font-body text-[10px] uppercase text-muted-foreground">
                      {story.publishedAt}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-12 p-6 bg-muted/30 border border-border">
                <h3 className="font-body text-xs font-bold uppercase tracking-widest mb-4">Listen to the Podcast</h3>
                <div className="w-full aspect-square bg-foreground text-background flex items-center justify-center p-4 text-center">
                  <span className="font-editorial text-2xl font-bold italic">The Daily IndoTimes</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </article>
    </div>
  );
}
