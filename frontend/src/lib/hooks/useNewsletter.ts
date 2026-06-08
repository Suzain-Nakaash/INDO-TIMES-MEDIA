import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsletterService } from '../services/newsletter-service';

export const newsletterKeys = {
  all: ['newsletter'] as const,
  subscribers: (page: number, limit: number) =>
    [...newsletterKeys.all, 'subscribers', page, limit] as const,
};

export function useSubscribe() {
  return useMutation({
    mutationFn: (email: string) => newsletterService.subscribe(email),
  });
}

export function useSubscribers(page = 1, limit = 20) {
  return useQuery({
    queryKey: newsletterKeys.subscribers(page, limit),
    queryFn: () => newsletterService.getSubscribers(page, limit),
  });
}

export function useExportSubscribers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const blob = await newsletterService.exportCsv();
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
    },
  });
}
