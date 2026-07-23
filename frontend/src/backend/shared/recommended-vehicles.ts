import { createServerFn } from "@tanstack/react-start";
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const BACKEND_URL = import.meta.env.VITE_WEBSITE_BACKEND_URL || process.env.VITE_WEBSITE_BACKEND_URL || "http://localhost:3000/api";
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

export const getRecommendedVehiclesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      return await apiFetch('/recommended-vehicles');
    } catch (err) {
      console.error("Failed to fetch recommended vehicles", err);
      return [];
    }
  });

export const saveRecommendedVehiclesFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; vehicles: any[] }) => data)
  .handler(async ({ data }: { data: { adminToken: string; vehicles: any[] } }) => {
    if (!isValidAdminToken(data?.adminToken)) {
      throw new Error("Unauthorized");
    }
    
    return await apiFetch('/recommended-vehicles', {
      method: "POST",
      body: JSON.stringify(data.vehicles),
    });
  });
