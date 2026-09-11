import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
import { z } from 'zod';

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

export const getCustomBlogsFn = createServerFn({ method: "POST" })
  .validator((data?: unknown) => {
    return z.object({
      forceFresh: z.boolean().optional(),
    }).optional().parse(data);
  })
  .handler(async ({ data }) => {
    try {
      const cacheBust = data?.forceFresh ? `?_t=${Date.now()}` : '';
      return await apiFetch(`/custom-blogs${cacheBust}`);
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
      return await apiFetch(`/custom-blogs/slug/${data.slug}`);
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
      return await apiFetch('/custom-blogs', {
        method: "POST",
        body: JSON.stringify(data),
      });
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
      return await apiFetch(`/custom-blogs/${data.id}`, {
        method: "DELETE",
      });
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
