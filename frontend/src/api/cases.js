const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  const appBase =
    import.meta.env.VITE_APP_URL ||
    (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "") ||
    "";

  return appBase + (url.startsWith("/") ? url : `/${url}`);
};

const normalizeCase = (item = {}) => {
  const coverFromCollections =
    item?.media_collections?.cover?.[0]?.url ||
    item?.gallery?.[0]?.url ||
    "";

  return {
    id: item.id,
    title: item.title || "",
    category:
      item.category ||
      item.industry ||
      item?.taxonomies?.[0]?.title ||
      "",
    cover_image: resolveMediaUrl(item.cover_image || item.cover || coverFromCollections),
    slug: item.slug || "",
  };
};

export async function fetchCases() {
  const response = await fetch(`${API_BASE_URL}/cases`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  const rawCases = Array.isArray(payload) ? payload : payload?.data || [];
  return rawCases.map(normalizeCase).filter((item) => item.slug && item.title);
}

export default {
  fetchCases,
};
