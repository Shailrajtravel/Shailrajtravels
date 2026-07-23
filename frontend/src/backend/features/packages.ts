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

export const getPackagesFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    return await apiFetch('/packages');
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
    return await apiFetch('/packages', {
      method: "POST",
      body: JSON.stringify(data.data),
    });
  });

export const updatePackageFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; data: any }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/packages/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data.data),
    });
  });

export const deletePackageFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/packages/${data.id}`, {
      method: "DELETE",
    });
  });
