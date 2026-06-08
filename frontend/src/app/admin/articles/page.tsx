"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Send, FileEdit, Eye } from "lucide-react";
import { useAdminArticles, useDeleteArticle, usePublishArticle, useDraftArticle } from "@/lib/hooks/useArticles";
import type { ArticleStatus } from "@/lib/types";

export default function AdminArticlesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useAdminArticles(page, 20, statusFilter);
  const deleteArticle = useDeleteArticle();
  const publishArticle = usePublishArticle();
  const draftArticle = useDraftArticle();

  const articles = data?.articles || [];
  const meta = data?.meta;

  const filteredArticles = searchQuery
    ? articles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles;

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteArticle.mutate(id);
    }
  };

  const statusColors: Record<ArticleStatus, string> = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 mt-1">Manage your news articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-2">
          {(["All", "PUBLISHED", "DRAFT", "ARCHIVED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status === "All" ? undefined : status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (status === "All" && !statusFilter) || statusFilter === status
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "All" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Views</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate">{article.title}</td>
                  <td className="py-3 px-4 text-gray-500">{article.category.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[article.status]}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(article.publishedAt || article.createdAt)}</td>
                  <td className="py-3 px-4 text-right font-mono text-gray-600">{article.views.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/article/${article.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      {article.status === "DRAFT" ? (
                        <button
                          onClick={() => publishArticle.mutate(article.id)}
                          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                          title="Publish"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      ) : article.status === "PUBLISHED" ? (
                        <button
                          onClick={() => draftArticle.mutate(article.id)}
                          className="p-1.5 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="Revert to Draft"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredArticles.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!meta.hasPrevPage}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {meta.page} of {meta.totalPages}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!meta.hasNextPage}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
