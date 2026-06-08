import { NewsCard } from "@/components/shared/news-card";
import { Article } from "@/types";

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Global Markets Rally as Tech Stocks Hit Record Highs",
    slug: "global-markets-rally-tech-stocks",
    excerpt: "Investors saw a significant boost in their portfolios today as major tech companies reported better-than-expected earnings for Q3.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
    category: { id: "1", name: "Business", slug: "business" },
    author: { id: "1", name: "Jane Doe", avatar: "" },
    publishedAt: new Date().toISOString(),
    views: 1200,
  },
  {
    id: "2",
    title: "New Climate Agreement Signed by 50 Nations in Paris",
    slug: "new-climate-agreement-paris",
    excerpt: "World leaders gathered today to commit to ambitious new targets for reducing carbon emissions by 2030.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
    category: { id: "2", name: "World", slug: "world" },
    author: { id: "2", name: "John Smith", avatar: "" },
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    views: 3500,
  },
  {
    id: "3",
    title: "The Future of AI: How Machine Learning is Transforming Healthcare",
    slug: "future-of-ai-healthcare",
    excerpt: "From early diagnosis to personalized treatment plans, AI is making waves in the medical field.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=2068&auto=format&fit=crop",
    category: { id: "3", name: "Technology", slug: "technology" },
    author: { id: "3", name: "Alice Johnson", avatar: "" },
    publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    views: 890,
  },
  {
    id: "4",
    title: "Championship Finals: Underdogs Take Home the Trophy",
    slug: "championship-finals-underdogs",
    excerpt: "In a stunning upset, the city's beloved underdog team defeated the reigning champions in overtime.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2005&auto=format&fit=crop",
    category: { id: "4", name: "Sports", slug: "sports" },
    author: { id: "4", name: "Bob Williams", avatar: "" },
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    views: 5200,
  },
  {
    id: "5",
    title: "Upcoming Elections: What You Need to Know Before Voting",
    slug: "upcoming-elections-guide",
    excerpt: "A comprehensive guide to the candidates, their platforms, and where you can cast your ballot.",
    content: "Full content here...",
    featuredImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop",
    category: { id: "5", name: "Politics", slug: "politics" },
    author: { id: "5", name: "Eva Green", avatar: "" },
    publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    views: 2100,
  }
];

export default function HomePage() {
  const heroArticle = mockArticles[0];
  const featuredArticles = mockArticles.slice(1, 3);
  const latestArticles = mockArticles.slice(3);
  const trendingArticles = mockArticles.slice(1, 5).reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Section: Hero + Featured */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 mb-12">
        <div className="lg:col-span-8">
          <NewsCard article={heroArticle} variant="hero" />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-4">
          {featuredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <h2 className="font-heading text-2xl font-bold">Latest News</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {latestArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
            {/* Duplicate for visual bulk */}
            {mockArticles.map((article) => (
              <NewsCard key={article.id + "_dup"} article={article} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="mb-6 border-b pb-4">
              <h2 className="font-heading text-2xl font-bold">Trending</h2>
            </div>
            <div className="flex flex-col gap-6">
              {trendingArticles.map((article, i) => (
                <div key={article.id} className="flex gap-4 items-start">
                  <span className="font-heading text-4xl font-black text-muted-foreground/30 leading-none">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <NewsCard article={article} variant="compact" />
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Widget */}
            <div className="mt-12 rounded-xl bg-primary p-6 text-primary-foreground">
              <h3 className="font-heading text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Get the daily top stories delivered directly to your inbox.
              </p>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
                <button
                  type="submit"
                  className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
