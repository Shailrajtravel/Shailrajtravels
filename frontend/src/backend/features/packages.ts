import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
import { getCachedData, setCachedData, invalidateCache } from '@/backend/infrastructure/redis';
import { memoryCache } from '@/backend/shared/memory-cache';
import { fastApiFetch } from '@/backend/shared/fast-fetch';
import { seedPackages } from '@/backend/shared/seed-data';

export const getPackagesFn = createServerFn({ method: "POST" })
  .validator((data?: { forceFresh?: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data?.forceFresh) {
        // 1. Check L1 Memory Cache with SWR (0ms)
        const { value: cached, isStale } = memoryCache.getWithMeta<any[]>('packages:all');
        if (cached && Array.isArray(cached) && cached.length > 0) {
          // If stale, trigger background revalidation without blocking SSR
          if (isStale) {
            fastApiFetch('/packages', { timeoutMs: 3000 })
              .then(async (fresh) => {
                if (fresh && Array.isArray(fresh) && fresh.length > 0) {
                  await setCachedData('packages:all', fresh, 3600);
                }
              })
              .catch(() => {});
          }
          return cached;
        }

        // 2. Check L2 Redis Cache (max 500ms)
        const l2 = await getCachedData<any[]>('packages:all');
        if (l2 && Array.isArray(l2) && l2.length > 0) {
          return l2;
        }
      }

      // 3. Fast network fetch with 2000ms max timeout
      const liveData = await fastApiFetch('/packages', { timeoutMs: 2000 }).catch(() => null);
      if (liveData && Array.isArray(liveData) && liveData.length > 0) {
        await setCachedData('packages:all', liveData, 3600);
        return liveData;
      }
      return seedPackages;
    } catch (error) {
      console.error("Failed to fetch packages", error);
      return seedPackages;
    }
  });

type PackageInput = {
  adminToken: string;
  data: any;
};

export const createPackageFn = createServerFn({ method: "POST" })
  .validator((data: PackageInput) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await fastApiFetch('/packages', {
      method: "POST",
      body: JSON.stringify(data.data),
    });
    await invalidateCache('packages:all');
    await invalidateCache('tours:en');
    await invalidateCache('tours:mr');
    return result;
  });

export const updatePackageFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; data: any }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await fastApiFetch(`/packages/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data.data),
    });
    await invalidateCache('packages:all');
    await invalidateCache('tours:en');
    await invalidateCache('tours:mr');
    if (data?.data?.slug) {
      await invalidateCache(`tour:slug:${data.data.slug.toLowerCase().trim()}:en`);
      await invalidateCache(`tour:slug:${data.data.slug.toLowerCase().trim()}:mr`);
    }
    return result;
  });

export const deletePackageFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await fastApiFetch(`/packages/${data.id}`, {
      method: "DELETE",
    });
    await invalidateCache('packages:all');
    await invalidateCache('tours:en');
    await invalidateCache('tours:mr');
    return result;
  });
