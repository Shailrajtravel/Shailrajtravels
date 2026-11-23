import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
import { z } from 'zod';
import { memoryCache } from '@/backend/shared/memory-cache';
import { fastApiFetch, apiFetch } from '@/backend/shared/fast-fetch';

export const getCustomBlogsFn = createServerFn({ method: "POST" })
  .validator((data?: unknown) => {
    return z.object({
      forceFresh: z.boolean().optional(),
    }).optional().parse(data);
  })
  .handler(async ({ data }) => {
    try {
      if (!data?.forceFresh) {
        const { value: cached, isStale } = memoryCache.getWithMeta<any[]>('custom-blogs:all');
        if (cached && Array.isArray(cached) && cached.length > 0) {
          if (isStale) {
            fastApiFetch('/custom-blogs', { timeoutMs: 3000 })
              .then((fresh) => {
                if (fresh && Array.isArray(fresh) && fresh.length > 0) {
                  memoryCache.set('custom-blogs:all', fresh, 3600);
                }
              })
              .catch(() => {});
          }
          return cached;
        }
      }

      const fresh = await fastApiFetch('/custom-blogs', { timeoutMs: 2000 }).catch(() => null);
      if (fresh && Array.isArray(fresh) && fresh.length > 0) {
        memoryCache.set('custom-blogs:all', fresh, 3600);
        return fresh;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch custom blogs", error);
      return [];
    }
  });

export const getCustomBlogBySlugFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({
      slug: z.string(),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const cacheKey = `custom-blog:slug:${data.slug.toLowerCase().trim()}`;
      const cached = memoryCache.get<any>(cacheKey);
      if (cached) return cached;

      const live = await fastApiFetch(`/custom-blogs/slug/${data.slug}`, { timeoutMs: 2000 }).catch(() => null);
      if (live) {
        memoryCache.set(cacheKey, live, 3600);
        return live;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch custom blog by slug", error);
      return null;
    }
  });

export const createCustomBlogFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({
      adminToken: z.string(),
      title: z.string().min(3, "Title must be at least 3 characters"),
      content: z.string().min(10, "Content must be at least 10 characters"),
      authorName: z.string().min(2, "Author name must be at least 2 characters"),
      category: z.string().min(2, "Category is required"),
      thumbnailBase64: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      tags: z.union([z.array(z.string()), z.string()]).optional(),
    }).refine((val) => (val.thumbnailBase64 && val.thumbnailBase64.length > 0) || (val.thumbnailUrl && val.thumbnailUrl.length > 0), {
      message: "A poster or thumbnail image is required (either file upload or image URL)",
      path: ["thumbnailUrl"],
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      if (!isValidAdminToken(data.adminToken)) throw new Error("Unauthorized");
      const res = await fastApiFetch('/custom-blogs', {
        method: "POST",
        body: JSON.stringify(data),
      });
      memoryCache.delete('custom-blogs:all');
      return res;
    } catch (error: any) {
      console.error("Failed to create custom blog", error);
      throw new Error(error.message || "Failed to create custom blog");
    }
  });

export const deleteCustomBlogFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({
      adminToken: z.string(),
      id: z.string(),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      if (!isValidAdminToken(data.adminToken)) {
        throw new Error("Unauthorized");
      }
      const res = await fastApiFetch(`/custom-blogs/${data.id}`, {
        method: "DELETE",
      });
      memoryCache.delete('custom-blogs:all');
      return res;
    } catch (error: any) {
      console.error("Failed to delete custom blog", error);
      throw new Error(error.message || "Failed to delete custom blog");
    }
  });

export const updateCustomBlogFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({
      adminToken: z.string(),
      id: z.string(),
      title: z.string().min(3),
      content: z.string().min(10),
      authorName: z.string().min(2),
      category: z.string().min(2),
      thumbnailBase64: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      tags: z.union([z.array(z.string()), z.string()]).optional(),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      if (!isValidAdminToken(data.adminToken)) {
        throw new Error("Unauthorized");
      }
      return await apiFetch(`/custom-blogs/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      console.error("Failed to update custom blog", error);
      throw new Error(error.message || "Failed to update custom blog");
    }
  });

export const toggleBlogVisibilityFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return z.object({
      adminToken: z.string(),
      id: z.string(),
      isHidden: z.boolean(),
    }).parse(data);
  })
  .handler(async ({ data }) => {
    try {
      if (!isValidAdminToken(data.adminToken)) throw new Error("Unauthorized");
      return await apiFetch(`/custom-blogs/${data.id}/visibility`, {
        method: "PUT",
        body: JSON.stringify({ isHidden: data.isHidden }),
      });
    } catch (error: any) {
      console.error("Failed to toggle blog visibility", error);
      throw new Error(error.message || "Failed to toggle blog visibility");
    }
  });
