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

export const getToursFn = createServerFn({ method: "POST" })
  .validator((data?: { lang?: string }) => data || {})
  .handler(async ({ data }) => {
    try {
      const qs = data.lang ? `?lang=${data.lang}` : "";
      return await apiFetch(`/tours${qs}`);
    } catch (error) {
      console.error("Failed to fetch tours", error);
      return [];
    }
  });

export const getTourBySlugFn = createServerFn({ method: "POST" })
  .validator((data: { slug: string; lang?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const qs = data.lang ? `?lang=${data.lang}` : "";
      return await apiFetch(`/tours/slug/${data.slug}${qs}`);
    } catch (error) {
      console.error("Failed to fetch tour by slug", error);
      return null;
    }
  });

type TourInput = {
  adminToken: string;
  data: any;
};

export const createTourFn = createServerFn({ method: "POST" })
  .validator((data: TourInput) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch('/tours', {
      method: "POST",
      body: JSON.stringify(data.data),
    });
  });

export const updateTourFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; data: any }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/tours/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data.data),
    });
  });

export const deleteTourFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/tours/${data.id}`, {
      method: "DELETE",
    });
  });

export const deleteToursBySlugFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; slug: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/tours/slug/${data.slug}`, {
      method: "DELETE",
    });
  });
