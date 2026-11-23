import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
import { getCachedData, setCachedData, invalidateCache } from '@/backend/infrastructure/redis';
import { memoryCache } from '@/backend/shared/memory-cache';
import { fastApiFetch } from '@/backend/shared/fast-fetch';
import { seedTours } from '@/backend/shared/seed-data';

export const sortToursByRank = (items: any[]): any[] => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a: any, b: any) => {
    const rA = typeof a.order === 'number' && a.order > 0 ? a.order : (typeof a.rank === 'number' && a.rank > 0 ? a.rank : 999999);
    const rB = typeof b.order === 'number' && b.order > 0 ? b.order : (typeof b.rank === 'number' && b.rank > 0 ? b.rank : 999999);
    if (rA !== rB) return rA - rB;
    return 0;
  });
};

export const getToursFn = createServerFn({ method: "POST" })
  .validator((data?: { lang?: string; forceFresh?: boolean }) => data || {})
  .handler(async ({ data }) => {
    const langKey = data?.lang || "en";
    const cacheKey = `tours:${langKey}`;
    try {
      if (!data?.forceFresh) {
        // 1. Check L1 Memory Cache with SWR (0ms)
        const { value: cached, isStale } = memoryCache.getWithMeta<any[]>(cacheKey);
        if (cached && Array.isArray(cached) && cached.length > 0) {
          if (isStale) {
            const qs = data?.lang ? `?lang=${data.lang}` : "";
            fastApiFetch(`/tours${qs}`, { timeoutMs: 3000 })
              .then(async (fresh) => {
                if (fresh && Array.isArray(fresh) && fresh.length > 0) {
                  const sorted = sortToursByRank(fresh);
                  await setCachedData(cacheKey, sorted, 3600);
                }
              })
              .catch(() => {});
          }
          return sortToursByRank(cached);
        }

        // 2. Check L2 Redis Cache (max 500ms)
        const l2 = await getCachedData<any[]>(cacheKey);
        if (l2 && Array.isArray(l2) && l2.length > 0) {
          return sortToursByRank(l2);
        }
      }

      // 3. Fast network fetch with 2000ms max timeout
      const qs = data?.lang ? `?lang=${data.lang}` : "";
      const result = await fastApiFetch(`/tours${qs}`, { timeoutMs: 2000 }).catch(() => null);
      if (Array.isArray(result) && result.length > 0) {
        const sorted = sortToursByRank(result);
        await setCachedData(cacheKey, sorted, 3600);
        return sorted;
      }
      return sortToursByRank(seedTours);
    } catch (error) {
      console.error("Failed to fetch tours", error);
      return sortToursByRank(seedTours);
    }
  });

export const getTourBySlugFn = createServerFn({ method: "POST" })
  .validator((data: { slug: string; lang?: string }) => data)
  .handler(async ({ data }) => {
    const slugKey = data.slug.toLowerCase().trim();
    const cacheKey = `tour:slug:${slugKey}:${data.lang || "en"}`;
    try {
      // 1. Check L1 Memory Cache with SWR (0ms)
      const { value: cached, isStale } = memoryCache.getWithMeta<any>(cacheKey);
      if (cached) {
        if (isStale) {
          const qs = data.lang ? `?lang=${data.lang}` : "";
          fastApiFetch(`/tours/slug/${slugKey}${qs}`, { timeoutMs: 3000 })
            .then(async (fresh) => {
              if (fresh) {
                await setCachedData(cacheKey, fresh, 3600);
              }
            })
            .catch(() => {});
        }
        return cached;
      }

      // 2. Check L2 Redis Cache
      const l2 = await getCachedData<any>(cacheKey);
      if (l2) return l2;

      // 3. Fast network fetch with 2000ms max timeout
      const qs = data.lang ? `?lang=${data.lang}` : "";
      const result = await fastApiFetch(`/tours/slug/${slugKey}${qs}`, { timeoutMs: 2000 }).catch(() => null);
      if (result) {
        await setCachedData(cacheKey, result, 3600);
        return result;
      }

      // 4. Instant fallback to static seed data
      const seedMatch = seedTours.find((t: any) => 
        (t.slug && t.slug.toLowerCase() === slugKey) ||
        (slugKey.includes("ujjain") && t.slug === "pune-to-ujjain-tour-package")
      );
      if (seedMatch) return seedMatch;
      return null;
    } catch (error) {
      console.error("Failed to fetch tour by slug", error);
      const seedMatch = seedTours.find((t: any) => 
        (t.slug && t.slug.toLowerCase() === slugKey) ||
        (slugKey.includes("ujjain") && t.slug === "pune-to-ujjain-tour-package")
      );
      return seedMatch || null;
    }
  });

type TourInput = {
  adminToken: string;
  data: any;
};

const invalidateTourCaches = async (slug?: string) => {
  await invalidateCache('tours:en');
  await invalidateCache('tours:mr');
  await invalidateCache('packages:all');
  if (slug) {
    await invalidateCache(`tour:slug:${slug}:en`);
    await invalidateCache(`tour:slug:${slug}:mr`);
  }
};

export const createTourFn = createServerFn({ method: "POST" })
  .validator((data: TourInput) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await fastApiFetch('/tours', {
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
    const result = await fastApiFetch(`/tours/${data.id}`, {
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
    const result = await fastApiFetch(`/tours/${data.id}`, {
      method: "DELETE",
    });
    await invalidateTourCaches();
    return result;
  });

export const deleteToursBySlugFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; slug: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await fastApiFetch(`/tours/slug/${data.slug}`, {
      method: "DELETE",
    });
    await invalidateTourCaches(data.slug);
    return result;
  });
