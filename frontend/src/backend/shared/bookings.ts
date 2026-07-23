import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
export { getAdminToken, isValidAdminToken };
import { z } from 'zod';

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

// ---- TRIP OPTIONS ----
export const getTripOptionsFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    return await apiFetch('/bookings/trip-options');
  } catch (error) {
    console.error("Failed to fetch trip options", error);
    return [];
  }
});

export const createTripOptionFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; data: any }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch('/bookings/trip-options', {
      method: "POST",
      body: JSON.stringify(data.data),
    });
  });

export const updateTripOptionFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; data: any }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/trip-options/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data.data),
    });
  });

export const deleteTripOptionFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/trip-options/${data.id}`, {
      method: "DELETE",
    });
  });

// ---- BOOKINGS ----
export const getBookingsFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    try {
      return await apiFetch('/bookings');
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      return [];
    }
  });

export const saveInvoiceFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; bookingId: string; invoiceCustomData: any }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/${data.bookingId}/invoice`, {
      method: "POST",
      body: JSON.stringify({ invoiceCustomData: data.invoiceCustomData, adminToken: data.adminToken }),
    });
  });

export const sendInvoiceWhatsAppFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; bookingId: string; phone?: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/${data.bookingId}/invoice/whatsapp`, {
      method: "POST",
      body: JSON.stringify({ phone: data.phone, adminToken: data.adminToken }),
    });
  });

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  tripName: z.string().min(1, "Trip name is required"),
  travelDate: z.string().optional(),
  persons: z.union([z.string(), z.number()]).optional(),
  customDestination: z.string().optional(),
  pickupLocation: z.string().optional(),
  paymentStatus: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export const createBookingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      return await apiFetch('/bookings', {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      console.error("Failed to submit booking", error);
      throw new Error(error.message || "Failed to submit booking");
    }
  });

export const updateBookingDateFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; travelDate: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/${data.id}/date`, {
      method: "PUT",
      body: JSON.stringify({ date: data.travelDate }),
    });
  });

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; status: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/${data.id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: data.status }),
    });
  });

export const sendBookingReplyFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; message: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/${data.id}/reply`, {
      method: "POST",
      body: JSON.stringify({ message: data.message, adminToken: data.adminToken }),
    });
  });

export const updateBookingPaymentStatusFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string; paymentStatus: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/${data.id}/payment`, {
      method: "PUT",
      body: JSON.stringify({ paymentStatus: data.paymentStatus, adminToken: data.adminToken }),
    });
  });

export const deleteBookingFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/${data.id}`, {
      method: "DELETE",
    });
  });

export const getBookingForPrintFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; bookingId: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");
    return await apiFetch(`/bookings/${data.bookingId}/print`);
  });

export const getPublicStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await apiFetch('/bookings/public-stats');
  } catch (error) {
    console.error("Failed to fetch public stats", error);
    return {
      travelersCount: 0,
      packagesCount: 0,
      toursCount: 0,
      tripOptionsCount: 0,
      avgRating: 4.9,
    };
  }
});
