import { prisma } from '@/config/database';
import { deleteCachePattern } from '@/config/redis';
import { ApiError } from '@/utils/ApiError';
import { createUniqueCategorySlug } from '@/utils/slugify';
import { CACHE_KEYS } from '@/utils/constants';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schema';

class CategoriesService {
  /**
   * Create a new category
   */
  async create(input: CreateCategoryInput) {
    const slug = await createUniqueCategorySlug(input.name);

    const category = await prisma.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
      },
    });

    await this.invalidateCache();
    return category;
  }

  /**
   * Get all categories
   */
  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });
  }

  /**
   * Get a single category by ID
   */
  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    return category;
  }

  /**
   * Update a category
   */
  async update(id: string, input: UpdateCategoryInput) {
    await this.findById(id); // Throws if not found

    const data: Record<string, unknown> = {};

    if (input.name) {
      data.name = input.name;
      data.slug = await createUniqueCategorySlug(input.name);
    }

    if (input.description !== undefined) {
      data.description = input.description;
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    await this.invalidateCache();
    return category;
  }

  /**
   * Delete a category
   */
  async delete(id: string) {
    const category = await this.findById(id);

    // Check if category has articles
    const articleCount = await prisma.article.count({
      where: { categoryId: id },
    });

    if (articleCount > 0) {
      throw ApiError.badRequest(
        `Cannot delete category "${category.name}" — it has ${articleCount} article(s). Move or delete them first.`,
      );
    }

    await prisma.category.delete({ where: { id } });
    await this.invalidateCache();
  }

  // ── Private helpers ───────────────────────────────────────

  private async invalidateCache() {
    await deleteCachePattern(`${CACHE_KEYS.categories}*`);
  }
}

export const categoriesService = new CategoriesService();
