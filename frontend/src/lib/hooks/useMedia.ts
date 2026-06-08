import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaService } from '../services/media-service';
import type { MediaQuery } from '../types';

export const mediaKeys = {
  all: ['media'] as const,
  list: (query: MediaQuery) => [...mediaKeys.all, 'list', query] as const,
  detail: (id: string) => [...mediaKeys.all, id] as const,
};

export function useMediaLibrary(query: MediaQuery = {}) {
  return useQuery({
    queryKey: mediaKeys.list(query),
    queryFn: () => mediaService.getAll(query),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => mediaService.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mediaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}
