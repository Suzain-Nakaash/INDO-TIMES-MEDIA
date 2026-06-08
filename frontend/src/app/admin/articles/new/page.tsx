"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCreateArticle } from "@/lib/hooks/useArticles";
import { useCategories } from "@/lib/hooks/useCategories";
import type { CreateArticleInput } from "@/lib/types";

export default function NewArticlePage() {
  const router = useRouter();
  const createArticle = useCreateArticle();
  const { data: categories } = useCategories();

  const [form, setForm] = useState<CreateArticleInput>({
    title: "",
    summary: "",
    content: "",
    featuredImage: "",
    categoryId: "",
    seoTitle: "",
    seoDescription: "",
    tags: [],
    status: "DRAFT",
  });
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  const handleChange = (field: keyof CreateArticleInput, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags?.includes(tag)) {
      handleChange("tags", [...(form.tags || []), tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    handleChange("tags", (form.tags || []).filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.content || !form.categoryId) {
      setError("Title, content, and category are required.");
      return;
    }

    createArticle.mutate(form, {
      onSuccess: () => {
        router.push("/admin/articles");
      },
      onError: (err) => {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create article.";
        setError(message);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Article</h1>
          <p className="text-gray-500 mt-1">Create a new news article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Article headline"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Summary</label>
            <textarea
              value={form.summary || ""}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="Brief summary of the article"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content * (HTML supported)</label>
            <textarea
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="<p>Write your article content here...</p>"
              rows={15}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select a category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Featured Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image URL</label>
            <input
              type="url"
              value={form.featuredImage || ""}
              onChange={(e) => handleChange("featuredImage", e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">Upload images via the Media Library and paste the URL here</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {form.tags?.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                Add
              </button>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="text-lg font-bold text-gray-900">SEO Settings</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Title</label>
            <input
              type="text"
              value={form.seoTitle || ""}
              onChange={(e) => handleChange("seoTitle", e.target.value)}
              placeholder="Custom SEO title (defaults to article title)"
              maxLength={70}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">{(form.seoTitle || "").length}/70</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Description</label>
            <textarea
              value={form.seoDescription || ""}
              onChange={(e) => handleChange("seoDescription", e.target.value)}
              placeholder="Custom meta description (defaults to summary)"
              maxLength={160}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">{(form.seoDescription || "").length}/160</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="DRAFT">Save as Draft</option>
            <option value="PUBLISHED">Publish Immediately</option>
          </select>

          <div className="flex gap-3">
            <Link href="/admin/articles" className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createArticle.isPending}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {createArticle.isPending ? "Creating..." : "Create Article"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
