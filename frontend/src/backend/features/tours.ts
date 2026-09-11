import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
import { getCachedData, setCachedData, invalidateCache } from '@/backend/infrastructure/redis';

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const BACKEND_URL = import.meta.env.VITE_WEBSITE_BACKEND_URL || process.env.VITE_WEBSITE_BACKEND_URL || "https://shailrajtravels.onrender.com/api";
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `API Error: ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

import { seedTours } from '@/backend/shared/seed-data';

export const getToursFn = createServerFn({ method: "POST" })
  .validator((data?: { lang?: string; forceFresh?: boolean }) => data || {})
  .handler(async ({ data }) => {
    const langKey = data?.lang || "en";
    const cacheKey = `tours:${langKey}`;
    try {
      if (!data?.forceFresh) {
        const cached = await getCachedData<any[]>(cacheKey);
        if (cached && Array.isArray(cached) && cached.length > 0) {
          return cached;
        }
      }
      const qs = data?.lang ? `?lang=${data.lang}` : "";
      const result = await apiFetch(`/tours${qs}`);
      if (Array.isArray(result) && result.length > 0) {
        await setCachedData(cacheKey, result, 600);
        return result;
      }
      return seedTours;
    } catch (error) {
      console.error("Failed to fetch tours", error);
      return seedTours;
    }
  });

export const getTourBySlugFn = createServerFn({ method: "POST" })
  .validator((data: { slug: string; lang?: string }) => data)
  .handler(async ({ data }) => {
    const cacheKey = `tour:slug:${data.slug}:${data.lang || "en"}`;
    try {
      const cached = await getCachedData<any>(cacheKey);
      if (cached) return cached;
      const qs = data.lang ? `?lang=${data.lang}` : "";
      const result = await apiFetch(`/tours/slug/${data.slug}${qs}`);
      if (result) {
        await setCachedData(cacheKey, result, 600);
      }
      return result;
    } catch (error) {
      console.error("Failed to fetch tour by slug", error);
      return null;
    }
  });

type TourInput = {
  adminToken: string;
  data: any;
};

const invalidateTourCaches = async (slug?: string) => {
  await invalidateCache('tours:en');
  await invalidateCache('tours:mr');
  if (slug) {
    await invalidateCache(`tour:slug:${slug}:en`);
    await invalidateCache(`tour:slug:${slug}:mr`);
  }
};

export const createTourFn = createServerFn({ method: "POST" })
  .validator((data: TourInput) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await apiFetch('/tours', {
      method: "POST",
      body: JSON.stringify(data.data),
    });
    await invalidateTourCaches(data.data?.slug);
    return result;
  });

export const updateTourFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; data: any }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await apiFetch(`/tours/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data.data),
    });
    await invalidateTourCaches(data.data?.slug);
    return result;
  });

export const deleteTourFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await apiFetch(`/tours/${data.id}`, {
      method: "DELETE",
    });
    await invalidateTourCaches();
    return result;
  });

export const deleteToursBySlugFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; slug: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await apiFetch(`/tours/slug/${data.slug}`, {
      method: "DELETE",
    });
    await invalidateTourCaches(data.slug);
    return result;
  });
