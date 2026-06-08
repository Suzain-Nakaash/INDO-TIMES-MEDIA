"use client";

import { FileText, Eye, MessageCircle, Mail, Image as ImageIcon, TrendingUp, FileEdit, Archive } from "lucide-react";
import { useDashboardMetrics, usePopularArticles, useViewsBreakdown, useTrafficStats } from "@/lib/hooks/useAnalytics";

function MetricCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
      </div>
    </div>
  );
}

function TrafficChart({ data }: { data: { date: string; views: number }[] }) {
  if (!data || data.length === 0) return null;
  const maxViews = Math.max(...data.map((d) => d.views), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic — Last 30 Days</h3>
      <div className="flex items-end gap-1 h-40">
        {data.map((d) => (
          <div key={d.date} className="flex-1 flex flex-col items-center group relative">
            <div
              className="w-full bg-red-500 rounded-t hover:bg-red-600 transition-colors min-h-[2px]"
              style={{ height: `${Math.max((d.views / maxViews) * 100, 2)}%` }}
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {d.date}: {d.views} views
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: popular } = usePopularArticles(10);
  const { data: views } = useViewsBreakdown();
  const { data: traffic } = useTrafficStats();

  if (metricsLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your publication metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Articles" value={metrics?.totalArticles || 0} icon={FileText} color="bg-blue-500" />
        <MetricCard title="Published" value={metrics?.publishedArticles || 0} icon={TrendingUp} color="bg-green-500" />
        <MetricCard title="Drafts" value={metrics?.draftArticles || 0} icon={FileEdit} color="bg-yellow-500" />
        <MetricCard title="Total Views" value={metrics?.totalViews || 0} icon={Eye} color="bg-purple-500" />
        <MetricCard title="Comments" value={metrics?.totalComments || 0} icon={MessageCircle} color="bg-indigo-500" />
        <MetricCard title="Pending Comments" value={metrics?.pendingComments || 0} icon={Archive} color="bg-orange-500" />
        <MetricCard title="Subscribers" value={metrics?.totalSubscribers || 0} icon={Mail} color="bg-pink-500" />
        <MetricCard title="Media Files" value={metrics?.totalMedia || 0} icon={ImageIcon} color="bg-teal-500" />
      </div>

      {/* Views Breakdown */}
      {views && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Views Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{views.today.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Today</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{views.thisWeek.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">This Week</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{views.thisMonth.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">This Month</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{views.allTime.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">All Time</p>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Chart */}
      {traffic && <TrafficChart data={traffic} />}

      {/* Popular Articles */}
      {popular && popular.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Most Popular Articles</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Views</th>
                </tr>
              </thead>
              <tbody>
                {popular.map((article, i) => (
                  <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-400 font-mono">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 max-w-md truncate">{article.title}</td>
                    <td className="py-3 px-4 text-gray-500">{article.category.name}</td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900">{article.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
