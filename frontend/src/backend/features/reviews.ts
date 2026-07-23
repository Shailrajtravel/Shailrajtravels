import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
import { z } from 'zod';

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

export const getReviewsFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    return await apiFetch('/reviews');
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    return [];
  }
});

const addReviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  rating: z.number().min(1).max(5),
  text: z.string().min(5, "Review text is too short"),
});

export const addReviewFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => addReviewSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      return await apiFetch('/reviews', {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      console.error("Failed to add review", error);
      throw new Error(error.message || "Failed to add review");
    }
  });

export const deleteReviewFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/reviews/${data.id}`, {
      method: "DELETE",
    });
  });
