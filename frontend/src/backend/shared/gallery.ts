import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const BACKEND_URL = process.env.VITE_WEBSITE_BACKEND_URL || "http://localhost:3000/api";
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
    return await apiFetch('/gallery');
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
    return await apiFetch('/gallery', {
      method: "POST",
      body: JSON.stringify({ imageUrl: data.imageUrl }),
    });
  });

export const deleteGalleryPhotoFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/gallery/${data.id}`, {
      method: "DELETE",
    });
  });
