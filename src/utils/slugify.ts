import slugifyLib from 'slugify';
import { prisma } from '@/config/database';

/**
 * Generate a URL-safe slug from a string.
 * If a model with that slug already exists, appends a numeric suffix.
 */
export function createSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Generate a unique slug for articles by checking the database
 */
export async function createUniqueArticleSlug(title: string): Promise<string> {
  let slug = createSlug(title);

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (!existing) return slug;

  // Append incrementing suffix until unique
  let counter = 1;
  while (true) {
    const candidate = `${slug}-${counter}`;
    const found = await prisma.article.findUnique({ where: { slug: candidate } });
    if (!found) return candidate;
    counter++;
  }
}

/**
 * Generate a unique slug for categories by checking the database
 */
export async function createUniqueCategorySlug(name: string): Promise<string> {
  let slug = createSlug(name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (!existing) return slug;

  let counter = 1;
  while (true) {
    const candidate = `${slug}-${counter}`;
    const found = await prisma.category.findUnique({ where: { slug: candidate } });
    if (!found) return candidate;
    counter++;
  }
}
