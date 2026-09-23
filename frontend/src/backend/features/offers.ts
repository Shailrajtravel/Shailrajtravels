import { createServerFn } from '@tanstack/react-start';
import { isValidAdminToken } from '@/backend/infrastructure/token';
import { getCachedData, setCachedData, invalidateCache } from '@/backend/infrastructure/redis';

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface PromotionalOffer {
  _id?: string;
  slug: string;
  isActive: boolean;
  badge: string;
  title: string;
  subtitle: string;
  bannerImageUrl: string;
  offerPrice: string;
  originalPrice: string;
  priceUnit: string;
  urgencyText: string;
  vehicleName: string;
  highlights: string[];
  schedule: ScheduleItem[];
  route: string;
  pickupPoints: string[];
  inclusions: string[];
  exclusions: string[];
  ctaText: string;
  whatsappMessage: string;
  terms?: string;
  updatedAt?: string;
}

export const DEFAULT_OFFER: PromotionalOffer = {
  slug: "pune-to-lalbag-raja-darshan",
  isActive: true,
  badge: "ONE DAY TRIP",
  title: "Pune to Lalbag Raja Darshan",
  subtitle: "Faith | Travel | Blessings - Special One Day Trip",
  bannerImageUrl: "/images/offers/lalbag-raja-pune-offer.jpg",
  offerPrice: "999",
  originalPrice: "1,499",
  priceUnit: "per person",
  urgencyText: "Limited Seats in Luxury Force Urbania! 14th Sep Late Night Departure",
  vehicleName: "Luxury AC Force Urbania",
  highlights: [
    "Comfortable AC Travel",
    "Group Travel Friendly",
    "Safe & Reliable Chauffeurs",
    "Hassle-Free Darshan",
    "Spacious Seating",
    "Fully Air Conditioned",
    "Ample Luggage Space",
    "Ideal for Families, Friends & Devotees",
  ],
  schedule: [
    {
      time: "14th Sep (Late Night)",
      title: "Departure from Pune",
      description: "Night journey from Pune pickup points via Mumbai-Pune Expressway in luxury AC Force Urbania.",
    },
    {
      time: "15th Sep (Early Morning)",
      title: "Reach Mumbai",
      description: "Arrive in Mumbai fresh and energized near Lalbaug before dawn.",
    },
    {
      time: "15th Sep (Morning)",
      title: "Lalbaug Raja Darshan",
      description: "Holy darshan and blessings of Navsacha Lalbaugcha Raja with your loved ones.",
    },
    {
      time: "15th Sep (Afternoon)",
      title: "Return to Pune",
      description: "Board vehicle with sacred memories and reach Pune comfortably by evening.",
    },
  ],
  route: "Pune ➔ Mumbai-Pune Expressway ➔ Mumbai (Lalbag Raja) ➔ Pune",
  pickupPoints: [
    "Swargate",
    "Pune Station",
    "Shivajinagar",
    "Aundh",
    "Chandani Chowk",
    "Hinjawadi Flyover",
    "Wakad",
    "Nigdi Bhakti-Shakti",
  ],
  inclusions: [
    "Round-trip travel in Luxury AC Force Urbania",
    "Experienced and courteous highway driver",
    "All highway tolls, Mumbai entry taxes & parking fees included",
    "Complimentary packaged drinking water bottle",
    "Clean sanitised pure-veg highway halts for refresh",
  ],
  exclusions: [
    "VIP Darshan pass / coconut / floral offerings",
    "Meals, breakfast & personal expenses",
  ],
  ctaText: "Book Your Seat Now",
  whatsappMessage: "Hello Shailraj Travels, I want to book seats for Pune to Lalbag Raja Darshan One Day Trip at ₹999 per person in Force Urbania. Please confirm availability.",
  terms: "Advance booking of 50% required to confirm seat reservation. Remaining payment on boarding.",
  updatedAt: new Date().toISOString(),
};

const apiFetch = async (endpoint: string, options: RequestInit & { timeoutMs?: number } = {}) => {
  const BACKEND_URL = import.meta.env.VITE_WEBSITE_BACKEND_URL || process.env.VITE_WEBSITE_BACKEND_URL || "https://shailrajtravels.onrender.com/api";
  
  // For write operations (POST, PUT, DELETE), give generous 45s timeout to allow payload transfer and DB saves on Render
  // For read operations (GET), give 12s timeout
  const isWrite = options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase());
  const defaultTimeout = isWrite ? 45000 : 12000;
  const timeoutMs = options.timeoutMs ?? defaultTimeout;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `API Error: ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s while communicating with backend. Please try again.`);
    }
    throw err;
  }
};

export const getActiveOfferFn = createServerFn({ method: "GET" })
  .validator((data?: { forceFresh?: boolean }) => data)
  .handler(async ({ data }): Promise<PromotionalOffer | null> => {
    try {
      if (!data?.forceFresh) {
        const cached = await getCachedData<PromotionalOffer>('offers:active');
        if (cached && typeof cached === 'object' && cached.slug) {
          return cached;
        }
      }

      const liveOffer = await apiFetch('/offers/active');
      if (liveOffer && liveOffer.slug) {
        await setCachedData('offers:active', liveOffer, 300);
        return liveOffer;
      }
      return DEFAULT_OFFER.isActive ? DEFAULT_OFFER : null;
    } catch (error) {
      console.error("Failed to fetch active offer, using default fallback:", error);
      return DEFAULT_OFFER.isActive ? DEFAULT_OFFER : null;
    }
  });

export const getOfferBySlugFn = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<PromotionalOffer | null> => {
    try {
      const liveOffer = await apiFetch(`/offers/${data.slug}`);
      if (liveOffer && liveOffer.slug) {
        return liveOffer;
      }
      if (data.slug === DEFAULT_OFFER.slug) {
        return DEFAULT_OFFER;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch offer by slug ${data.slug}:`, error);
      return data.slug === DEFAULT_OFFER.slug ? DEFAULT_OFFER : null;
    }
  });

export const getOffersFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(async ({ data }): Promise<PromotionalOffer[]> => {
    if (!isValidAdminToken(data?.adminToken)) {
      throw new Error("Unauthorized");
    }
    try {
      const offers = await apiFetch('/offers');
      if (Array.isArray(offers) && offers.length > 0) {
        return offers;
      }
      return [DEFAULT_OFFER];
    } catch (error) {
      console.error("Failed to fetch all offers:", error);
      return [DEFAULT_OFFER];
    }
  });

export const saveOfferFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; offer: Partial<PromotionalOffer> }) => data)
  .handler(async ({ data }): Promise<PromotionalOffer> => {
    if (!isValidAdminToken(data?.adminToken)) {
      throw new Error("Unauthorized");
    }
    try {
      const result = await apiFetch('/offers', {
        method: "POST",
        body: JSON.stringify(data.offer),
      });
      await invalidateCache('offers:active');
      return result;
    } catch (error: any) {
      console.error("Failed to save offer:", error);
      throw new Error(error.message || "Failed to save offer");
    }
  });

export const toggleOfferStatusFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; slug: string; isActive: boolean }) => data)
  .handler(async ({ data }): Promise<boolean> => {
    if (!isValidAdminToken(data?.adminToken)) {
      throw new Error("Unauthorized");
    }
    try {
      const result = await apiFetch(`/offers/${data.slug}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: data.isActive }),
      });
      await invalidateCache('offers:active');
      return result;
    } catch (error: any) {
      console.error("Failed to toggle offer status:", error);
      throw new Error(error.message || "Failed to toggle offer status");
    }
  });

export const deleteOfferFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; slug: string }) => data)
  .handler(async ({ data }): Promise<boolean> => {
    if (!isValidAdminToken(data?.adminToken)) {
      throw new Error("Unauthorized");
    }
    try {
      const result = await apiFetch(`/offers/${data.slug}`, {
        method: "DELETE",
      });
      await invalidateCache('offers:active');
      return result;
    } catch (error: any) {
      console.error("Failed to delete offer:", error);
      throw new Error(error.message || "Failed to delete offer");
    }
  });
