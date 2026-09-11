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

export const getGalleryPhotosFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const cached = await getCachedData<any[]>('gallery:all');
    if (cached && Array.isArray(cached)) {
      return cached;
    }
    const data = await apiFetch('/gallery');
    if (data && Array.isArray(data)) {
      await setCachedData('gallery:all', data, 600);
    }
    return data || [];
  } catch (error) {
    console.error("Failed to fetch gallery photos", error);
    return [];
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
    const result = await apiFetch('/gallery', {
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
    const result = await apiFetch(`/gallery/${data.id}`, {
      method: "DELETE",
    });
    await invalidateCache('gallery:all');
    return result;
  });
