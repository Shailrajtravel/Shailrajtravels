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

export * from '@/backend/shared/reviews-data';
import {
  GoogleReviewItem,
  GoogleReviewStats,
  parseRelativeTimeToTimestamp,
  sortReviewsByLatest,
  fallbackGoogleReviews
} from '@/backend/shared/reviews-data';

export const getGoogleReviewStatsFn = createServerFn({ method: "GET" }).handler(async (): Promise<GoogleReviewStats> => {
  const { businessConfig } = await import('@/frontend/shared/config/business');
  const { redis } = await import('@/backend/infrastructure/redis');
  const { memoryCache } = await import('@/backend/shared/memory-cache');

  const placeId = "ChIJXRgrL53DwjsRs0FidQRovF0";
  const defaultStats: GoogleReviewStats = {
    rating: businessConfig.reviewRating || "5.0",
    reviewCount: businessConfig.reviewCount || "23",
    placeId,
    source: "business_default",
    lastSynced: new Date().toISOString(),
    writeReviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
    googleMapsUrl: `https://www.google.com/maps/place/Shailraj+Travels/@18.5116495,73.9655755,17z/data=!4m8!3m7!1s0x3bc2c39d2f2b185d:0x5dbc6804756241b3!8m2!3d18.5116495!4d73.9655755!9m1!1b1!16s%2Fg%2F11zd36ljtd?entry=ttu`,
    reviews: fallbackGoogleReviews,
  };

  const isStaleOrInvalid = (stats: any): boolean => {
    if (!stats) return true;
    if (stats.reviewCount === "25") return true;
    if (Array.isArray(stats.reviews)) {
      const hasFake = stats.reviews.some((r: any) =>
        r?.name?.includes("Dattatray") ||
        r?.name?.includes("Pravin") ||
        r?.text?.includes("Very trustworthy travel company for senior citizen")
      );
      if (hasFake) return true;
    }
    return false;
  };

  try {
    // 1. Invalidate any stale in-memory cache
    const memCached = memoryCache.get<GoogleReviewStats>("shailraj_google_review_stats");
    if (memCached) {
      if (isStaleOrInvalid(memCached)) {
        memoryCache.delete("shailraj_google_review_stats");
      } else {
        if (Array.isArray(memCached.reviews)) {
          memCached.reviews = sortReviewsByLatest(memCached.reviews);
        }
        return memCached;
      }
    }

    // 2. Check Redis cache
    if (redis) {
      try {
        const cached = await redis.get<GoogleReviewStats>("shailraj_google_review_stats");
        if (cached) {
          if (isStaleOrInvalid(cached)) {
            await redis.del("shailraj_google_review_stats");
          } else {
            if (Array.isArray(cached.reviews)) {
              cached.reviews = sortReviewsByLatest(cached.reviews);
            }
            memoryCache.set("shailraj_google_review_stats", cached, 21600);
            return cached;
          }
        }
      } catch (err) {
        console.error("Redis get stats error:", err);
      }
    }

    // 3. Automated Google Places API (New) live sync
    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY) ||
      "AIzaSyAup4bEJ4P18AlYRXOvVRjxLhpO9XYfSgc";

    if (apiKey) {
      try {
        const newUrl = `https://places.googleapis.com/v1/places/${placeId}`;
        const res = await fetch(newUrl, {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
          },
        });

        if (res.ok) {
          const json = await res.json();
          const apiReviews: GoogleReviewItem[] = (json.reviews || []).map((r: any, idx: number) => ({
            id: r.name || `rev-${idx}`,
            name: r.authorAttribution?.displayName || "Google Reviewer",
            rating: r.rating || 5,
            text: r.text?.text || r.originalText?.text || "",
            relativeTime: r.relativePublishTimeDescription || "Recently",
            authorPhotoUrl: r.authorAttribution?.photoUri,
            publishTime: r.publishTime,
            timestamp: r.publishTime ? Date.parse(r.publishTime) : undefined,
          }));

          // Merge live Places API reviews with our verified reviews list (deduplicating by author name)
          const mergedReviewsMap = new Map<string, GoogleReviewItem>();
          // Add fallback reviews first
          for (const rev of fallbackGoogleReviews) {
            mergedReviewsMap.set(rev.name.toLowerCase().trim(), rev);
          }
          // Overlay fresh Google Places API reviews
          for (const rev of apiReviews) {
            const key = rev.name.toLowerCase().trim();
            const existing = mergedReviewsMap.get(key);
            mergedReviewsMap.set(key, {
              ...existing,
              ...rev,
              textMr: existing?.textMr, // preserve Marathi translation if present
            });
          }

          const allUniqueReviews = Array.from(mergedReviewsMap.values());
          const sortedReviews = sortReviewsByLatest(allUniqueReviews);

          const stats: GoogleReviewStats = {
            rating: String(json.rating || defaultStats.rating),
            reviewCount: String(json.userRatingCount || defaultStats.reviewCount),
            placeId,
            source: 'google_places_api_v1',
            lastSynced: new Date().toISOString(),
            writeReviewUrl: defaultStats.writeReviewUrl,
            googleMapsUrl: defaultStats.googleMapsUrl,
            reviews: sortedReviews.length > 0 ? sortedReviews : fallbackGoogleReviews,
          };

          // Cache for 6 hours (21600s)
          memoryCache.set("shailraj_google_review_stats", stats, 21600);
          if (redis) {
            await redis.set("shailraj_google_review_stats", stats, { ex: 21600 });
          }
          return stats;
        }
      } catch (apiErr) {
        console.warn("Places API (New) fetch error:", apiErr);
      }
    }

    // 4. Check for admin override (if valid and not stale)
    const memOverride = memoryCache.get<Partial<GoogleReviewStats>>("shailraj_google_review_override");
    if (memOverride) {
      if (isStaleOrInvalid(memOverride)) {
        memoryCache.delete("shailraj_google_review_override");
      } else {
        return {
          ...defaultStats,
          ...memOverride,
          source: 'admin_override',
          reviews: Array.isArray(memOverride.reviews) ? sortReviewsByLatest(memOverride.reviews) : defaultStats.reviews,
        };
      }
    }

    // Cache fallback for 6 hours
    memoryCache.set("shailraj_google_review_stats", defaultStats, 21600);
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
      reviewCount: data.reviewCount?.trim() || "23",
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
