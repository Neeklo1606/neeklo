import { useQuery } from "@tanstack/react-query";
import { getPublicBootstrap } from "@/lib/api";

export function usePublicBootstrap(params?: { locale?: string }) {
  return useQuery({
    queryKey: ["public", "bootstrap", params?.locale ?? "default"],
    queryFn: async () => {
      const res = await getPublicBootstrap(params);
      if (!res.success || !res.data) throw new Error(res.message ?? "Failed to load bootstrap");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
