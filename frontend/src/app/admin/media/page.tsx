"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Check, Filter } from "lucide-react";
import { useMediaLibrary, useUploadMedia, useDeleteMedia } from "@/lib/hooks/useMedia";
import type { MediaFileType } from "@/lib/types";

export default function AdminMediaPage() {
  const [page, setPage] = useState(1);
  const [fileTypeFilter, setFileTypeFilter] = useState<MediaFileType | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useMediaLibrary({
    page,
    limit: 24,
    fileType: fileTypeFilter,
  });
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const media = data?.media || [];
  const meta = data?.meta;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      uploadMedia.mutate(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string, fileName: string) => {
    if (confirm(`Delete "${fileName}"? This cannot be undone.`)) {
      deleteMedia.mutate(id);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileTypes: { label: string; value: MediaFileType | undefined }[] = [
    { label: "All", value: undefined },
    { label: "Images", value: "image" },
    { label: "Videos", value: "video" },
    { label: "Audio", value: "audio" },
    { label: "PDFs", value: "pdf" },
    { label: "Documents", value: "document" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">Upload and manage your media files</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMedia.isPending}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploadMedia.isPending ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        {fileTypes.map((type) => (
          <button
            key={type.label}
            onClick={() => { setFileTypeFilter(type.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              fileTypeFilter === type.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Upload Progress */}
      {uploadMedia.isPending && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm">
          Uploading file... Please wait.
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No media files yet</p>
          <p className="text-sm mt-1">Upload your first file to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Preview */}
              <div className="aspect-square relative bg-gray-50">
                {item.fileType === "image" ? (
                  <Image src={item.url} alt={item.fileName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-300 uppercase">
                      {item.fileType === "video" ? "🎬" : item.fileType === "audio" ? "🎵" : item.fileType === "pdf" ? "📄" : "📎"}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs text-gray-700 font-medium truncate">{item.fileName}</p>
                <p className="text-[10px] text-gray-400">{formatSize(item.size)}</p>
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(item.url, item.id)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.fileName)}
                  className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
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
