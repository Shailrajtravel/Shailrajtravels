import { createServerFn } from '@tanstack/react-start';
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

export const addIssueFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    return await apiFetch('/issues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  });

export const getIssuesFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    try {
      return await apiFetch('/issues');
    } catch (error) {
      console.error("Failed to fetch issues", error);
      return [];
    }
  });

export const updateIssueStatusFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; status: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/issues/${data.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: data.status }),
    });
  });

export const deleteIssueFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/issues/${data.id}`, {
      method: "DELETE",
    });
  });
