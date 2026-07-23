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

export interface AuditLogEntry {
  _id?: string;
  action: string;
  entityType:
    | "System"
    | "Package"
    | "Gallery"
    | "Booking"
    | "Review"
    | "TripOption"
    | "Room"
    | "Tour"
    | "Invoice";
  entityId?: string;
  details: string;
  createdAt: Date;
}

// Internal helper for logging actions from other backend functions
export const logAuditAction = createServerFn({ method: "POST" })
  .validator(
    (data: {
      action: string;
      entityType: AuditLogEntry["entityType"];
      details: string;
      entityId?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      await apiFetch('/audit', {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to log audit action:", error);
    }
  });

// API endpoint for the Admin panel to fetch logs
export const getAuditLogsFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");

    try {
      return await apiFetch('/audit');
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      return [];
    }
  });
