// ── API Response Types ──────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ── Auth Types ──────────────────────────────────────────────

export interface AdminProfile {
  id: string;
  email: string;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  admin: AdminProfile;
  accessToken: string;
  refreshToken?: string;
}

// ── Category Types ──────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    articles: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

// ── Article Types ───────────────────────────────────────────

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featuredImage: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  status: ArticleStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  views: number;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface CreateArticleInput {
  title: string;
  summary?: string;
  content: string;
  featuredImage?: string;
  categoryId: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  status?: ArticleStatus;
}

export interface UpdateArticleInput {
  title?: string;
  summary?: string;
  content?: string;
  featuredImage?: string;
  categoryId?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

export interface ArticleSearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface ArticleFilterParams {
  categoryId?: string;
  status?: ArticleStatus;
  tags?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ── Comment Types ───────────────────────────────────────────

export interface Comment {
  id: string;
  articleId: string;
  name: string;
  email: string;
  comment: string;
  approved: boolean;
  createdAt: string;
}

// ── Media Types ─────────────────────────────────────────────

export type MediaFileType = 'image' | 'video' | 'audio' | 'pdf' | 'document';

export interface Media {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface MediaQuery {
  fileType?: MediaFileType;
  page?: number;
  limit?: number;
}

// ── Newsletter Types ────────────────────────────────────────

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

// ── Analytics Types ─────────────────────────────────────────

export interface DashboardMetrics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalComments: number;
  pendingComments: number;
  totalSubscribers: number;
  totalMedia: number;
}

export interface ViewsBreakdown {
  allTime: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
}

export interface TrafficData {
  date: string;
  views: number;
}

export interface PopularArticle {
  id: string;
  title: string;
  slug: string;
  views: number;
  publishedAt: string | null;
  category: {
    name: string;
    slug: string;
  };
}

// ── SEO Types ───────────────────────────────────────────────

export interface SEOMetadata {
  title: string;
  description: string;
  canonical: string;
  openGraph: Record<string, string | string[]>;
  twitterCard: Record<string, string>;
  jsonLd: Record<string, unknown>;
}
