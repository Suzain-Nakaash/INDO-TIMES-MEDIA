// ── File Upload Limits ──────────────────────────────────────

export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024, // 50MB
  pdf: 25 * 1024 * 1024, // 25MB
  document: 25 * 1024 * 1024, // 25MB
} as const;

// ── Allowed MIME Types ──────────────────────────────────────

export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'],
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mpeg', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/flac'],
  pdf: ['application/pdf'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
} as const;

export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES.image,
  ...ALLOWED_MIME_TYPES.video,
  ...ALLOWED_MIME_TYPES.audio,
  ...ALLOWED_MIME_TYPES.pdf,
  ...ALLOWED_MIME_TYPES.document,
];

// ── Cache TTLs (in seconds) ────────────────────────────────

export const CACHE_TTL = {
  categories: 3600, // 1 hour
  articleList: 600, // 10 minutes
  articleSingle: 1800, // 30 minutes
  analytics: 300, // 5 minutes
  sitemap: 3600, // 1 hour
  seoMeta: 1800, // 30 minutes
} as const;

// ── Cache Key Prefixes ──────────────────────────────────────

export const CACHE_KEYS = {
  categories: 'cache:categories',
  articleList: 'cache:articles:list',
  articleSingle: 'cache:articles:single',
  articleSlug: 'cache:articles:slug',
  analytics: 'cache:analytics',
  sitemap: 'cache:sitemap',
  seoMeta: 'cache:seo:meta',
  viewBuffer: 'buffer:views',
  tokenBlacklist: 'auth:blacklist',
} as const;

// ── Pagination Defaults ─────────────────────────────────────

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
} as const;

// ── File Type Mapping ───────────────────────────────────────

export function getFileCategory(mimeType: string): string {
  if (ALLOWED_MIME_TYPES.image.includes(mimeType as never)) return 'image';
  if (ALLOWED_MIME_TYPES.video.includes(mimeType as never)) return 'video';
  if (ALLOWED_MIME_TYPES.audio.includes(mimeType as never)) return 'audio';
  if (ALLOWED_MIME_TYPES.pdf.includes(mimeType as never)) return 'pdf';
  if (ALLOWED_MIME_TYPES.document.includes(mimeType as never)) return 'document';
  return 'unknown';
}
