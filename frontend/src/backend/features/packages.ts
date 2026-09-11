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

export const getPackagesFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const cached = await getCachedData<any[]>('packages:all');
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
    const data = await apiFetch('/packages');
    if (data && Array.isArray(data) && data.length > 0) {
      await setCachedData('packages:all', data, 600);
    }
    return data || [];
  } catch (error) {
    console.error("Failed to fetch packages", error);
    return [];
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
    const result = await apiFetch('/packages', {
      method: "POST",
      body: JSON.stringify(data.data),
    });
    await invalidateCache('packages:all');
    return result;
  });

export const updatePackageFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; data: any }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await apiFetch(`/packages/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data.data),
    });
    await invalidateCache('packages:all');
    return result;
  });

export const deletePackageFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    const result = await apiFetch(`/packages/${data.id}`, {
      method: "DELETE",
    });
    await invalidateCache('packages:all');
    return result;
  });
