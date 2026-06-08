"use client";

import { useState } from "react";
import { Download, Mail } from "lucide-react";
import { useSubscribers, useExportSubscribers } from "@/lib/hooks/useNewsletter";

export default function AdminNewsletterPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSubscribers(page, 25);
  const exportSubscribers = useExportSubscribers();

  const subscribers = data?.subscribers || [];
  const meta = data?.meta;

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-gray-500 mt-1">
            Manage subscribers{meta ? ` • ${meta.total} total` : ""}
          </p>
        </div>
        <button
          onClick={() => exportSubscribers.mutate()}
          disabled={exportSubscribers.isPending}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exportSubscribers.isPending ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No subscribers yet</p>
          <p className="text-sm mt-1">Subscribers will appear here when users sign up for the newsletter</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, i) => (
                <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-400 font-mono">{(page - 1) * 25 + i + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{sub.email}</td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(sub.subscribedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
