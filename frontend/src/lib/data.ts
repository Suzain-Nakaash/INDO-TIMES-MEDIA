export type Article = {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  readTime: string;
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Global Markets Surge as AI Innovations Promise New Economic Era",
    summary: "Leading tech firms announce breakthroughs in artificial general intelligence, sparking a global rally and prompting regulators to scramble for new frameworks.",
    category: "Technology",
    author: "Eleanor Sterling",
    publishedAt: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    readTime: "8 min read"
  },
  {
    id: "2",
    title: "Historic Peace Treaty Signed in Geneva After Months of Tension",
    summary: "Delegates from warring factions finally reached an agreement, ending a conflict that has destabilized the region for over a decade.",
    category: "World",
    author: "Marcus Thorne",
    publishedAt: "4 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&fit=crop",
    readTime: "6 min read"
  },
  {
    id: "3",
    title: "Central Bank Announces Surprise Rate Cut Amid Deflation Fears",
    summary: "In a move that shocked analysts, the central bank reduced interest rates by 50 basis points.",
    category: "Business",
    author: "Sarah Jenkins",
    publishedAt: "6 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    readTime: "5 min read"
  },
  {
    id: "4",
    title: "Breakthrough in Renewable Energy: Solid-State Batteries Hit Production",
    summary: "A major automaker claims its new battery technology will double EV range and halve charging times.",
    category: "Science",
    author: "David Chen",
    publishedAt: "8 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop",
    readTime: "7 min read"
  },
  {
    id: "5",
    title: "Major Film Festival Awards Top Prize to Indie Director",
    summary: "A low-budget drama swept the awards ceremony, marking a shift in the industry's focus.",
    category: "Entertainment",
    author: "Rachel Moore",
    publishedAt: "10 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
    readTime: "4 min read"
  }
];
