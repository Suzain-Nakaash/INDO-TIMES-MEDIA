export interface JwtPayload {
  id: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface FileUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

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

export interface TrafficData {
  date: string;
  views: number;
}
