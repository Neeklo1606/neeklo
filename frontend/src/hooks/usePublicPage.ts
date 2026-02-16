import { useQuery } from "@tanstack/react-query";
import { getPublicPage } from "@/lib/api";

export function usePublicPage(slug: string, params?: { locale?: string; enabled?: boolean }) {
  return useQuery({
    queryKey: ["public", "page", slug, params?.locale ?? "default"],
    queryFn: async () => {
      const res = await getPublicPage(slug, params);
      if (!res.success || !res.data) throw new Error(res.message ?? "Page not found");
      return res.data;
    },
    enabled: (params?.enabled ?? true) && !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
