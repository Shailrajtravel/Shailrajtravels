import { createServerFn } from '@tanstack/react-start';
import { getAdminToken, isValidAdminToken } from '@/backend/infrastructure/token';
import { z } from 'zod';

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

export interface GoogleReviewStats {
  rating: string;
  reviewCount: string;
  placeId: string;
  source: 'google_places_api' | 'admin_override' | 'business_default';
  lastSynced: string;
  writeReviewUrl: string;
  googleMapsUrl: string;
}

export const getGoogleReviewStatsFn = createServerFn({ method: "GET" }).handler(async (): Promise<GoogleReviewStats> => {
  const { businessConfig } = await import('@/frontend/shared/config/business');
  const { redis } = await import('@/backend/infrastructure/redis');
  const { memoryCache } = await import('@/backend/shared/memory-cache');

  const placeId = "ChIJXRgrL53DwjsRs0FidQRovF0";
  const defaultStats: GoogleReviewStats = {
    rating: businessConfig.reviewRating || "5.0",
    reviewCount: businessConfig.reviewCount || "12",
    placeId,
    source: "business_default",
    lastSynced: new Date().toISOString(),
    writeReviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Shailraj%20Travels&query_place_id=${placeId}`,
  };

  try {
    // 1. Check in-memory cache first
    const memCached = memoryCache.get<GoogleReviewStats>("shailraj_google_review_stats");
    if (memCached) return memCached;

    // 2. Check Redis cache
    if (redis) {
      try {
        const cached = await redis.get<GoogleReviewStats>("shailraj_google_review_stats");
        if (cached) {
          memoryCache.set("shailraj_google_review_stats", cached, 300);
          return cached;
        }
      } catch (err) {
        console.error("Redis get stats error:", err);
      }
    }

    // 3. Check for Google Places API key (automated live sync)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total&key=${apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.result && json.result.user_ratings_total) {
            const stats: GoogleReviewStats = {
              rating: String(json.result.rating || defaultStats.rating),
              reviewCount: String(json.result.user_ratings_total || defaultStats.reviewCount),
              placeId,
              source: 'google_places_api',
              lastSynced: new Date().toISOString(),
              writeReviewUrl: defaultStats.writeReviewUrl,
              googleMapsUrl: defaultStats.googleMapsUrl,
            };
            memoryCache.set("shailraj_google_review_stats", stats, 3600);
            if (redis) {
              await redis.set("shailraj_google_review_stats", stats, { ex: 3600 });
            }
            return stats;
          }
        }
      } catch (apiErr) {
        console.error("Google Places API live fetch error:", apiErr);
      }
    }

    // 4. Check for admin override in Redis or memory
    if (redis) {
      try {
        const override = await redis.get<Partial<GoogleReviewStats>>("shailraj_google_review_override");
        if (override) {
          const merged: GoogleReviewStats = {
            ...defaultStats,
            ...override,
            source: 'admin_override',
          };
          memoryCache.set("shailraj_google_review_stats", merged, 600);
          return merged;
        }
      } catch (err) {
        console.error("Redis get override error:", err);
      }
    }

    const memOverride = memoryCache.get<Partial<GoogleReviewStats>>("shailraj_google_review_override");
    if (memOverride) {
      return {
        ...defaultStats,
        ...memOverride,
        source: 'admin_override',
      };
    }

    return defaultStats;
  } catch (error) {
    console.error("Failed to get Google review stats", error);
    return defaultStats;
  }
});

export const updateGoogleReviewStatsFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; rating?: string; reviewCount?: string }) => data)
  .handler(async ({ data }) => {
    if (!isValidAdminToken(data?.adminToken)) throw new Error("Unauthorized");

    const { redis } = await import('@/backend/infrastructure/redis');
    const { memoryCache } = await import('@/backend/shared/memory-cache');

    const placeId = "ChIJXRgrL53DwjsRs0FidQRovF0";
    const updateData: Partial<GoogleReviewStats> = {
      rating: data.rating?.trim() || "5.0",
      reviewCount: data.reviewCount?.trim() || "12",
      placeId,
      lastSynced: new Date().toISOString(),
    };

    memoryCache.set("shailraj_google_review_override", updateData, 86400 * 30);
    memoryCache.delete("shailraj_google_review_stats");

    if (redis) {
      try {
        await redis.set("shailraj_google_review_override", updateData);
        await redis.del("shailraj_google_review_stats");
      } catch (err) {
        console.error("Redis set override error:", err);
      }
    }

    return { success: true, stats: updateData };
  });

