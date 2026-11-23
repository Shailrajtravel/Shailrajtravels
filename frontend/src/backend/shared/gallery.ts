import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
import { getCachedData, setCachedData, invalidateCache } from '@/backend/infrastructure/redis';
import { memoryCache } from '@/backend/shared/memory-cache';
import { fastApiFetch } from '@/backend/shared/fast-fetch';
import { seedGallery } from '@/backend/shared/seed-data';

export const getGalleryPhotosFn = createServerFn({ method: "POST" })
  .validator((data?: { forceFresh?: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data?.forceFresh) {
        // 1. Check L1 Memory Cache with SWR (0ms)
        const { value: cached, isStale } = memoryCache.getWithMeta<any[]>('gallery:all');
        if (cached && Array.isArray(cached) && cached.length > 0) {
          if (isStale) {
            fastApiFetch('/gallery', { timeoutMs: 3000 })
              .then(async (fresh) => {
                if (fresh && Array.isArray(fresh) && fresh.length > 0) {
                  await setCachedData('gallery:all', fresh, 3600);
                }
              })
              .catch(() => {});
          }
          return cached;
        }

        // 2. Check L2 Redis Cache
        const l2 = await getCachedData<any[]>('gallery:all');
        if (l2 && Array.isArray(l2) && l2.length > 0) {
          return l2;
        }
      }

      // 3. Fast network fetch (30s for forceFresh admin calls, 2500ms for SSR)
      const timeoutMs = data?.forceFresh ? 30000 : 2500;
      const liveData = await fastApiFetch('/gallery', { timeoutMs }).catch(() => null);
      if (liveData && Array.isArray(liveData) && liveData.length > 0) {
        await setCachedData('gallery:all', liveData, 3600);
        return liveData;
      }
      return seedGallery;
    } catch (error) {
      console.error("Failed to fetch gallery photos", error);
      return seedGallery;
    }
  });

type GalleryInput = {
  adminToken: string;
  imageUrl: string;
};

export const addGalleryPhotoFn = createServerFn({ method: "POST" })
  .validator((data: GalleryInput) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await fastApiFetch('/gallery', {
      method: "POST",
      body: JSON.stringify({ imageUrl: data.imageUrl }),
    });
    await invalidateCache('gallery:all');
    return result;
  });

export const deleteGalleryPhotoFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await fastApiFetch(`/gallery/${data.id}`, {
      method: "DELETE",
    });
    await invalidateCache('gallery:all');
    return result;
  });
