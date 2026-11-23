import { seedPackages, seedTours, seedTripOptions, seedGallery } from '@/backend/shared/seed-data';
import { DEFAULT_GOOGLE_REVIEWS } from '@/backend/shared/reviews-data';

type CacheItem<T> = {
  value: T;
  expiry: number;
  staleAt: number;
};

export class L1Cache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly maxSize: number;
  private readonly defaultTTL: number; // in seconds (default 3600 = 1 hour)
  private readonly defaultStaleTime: number; // in seconds (default 300 = 5 minutes)

  constructor(maxSize: number = 1000, defaultTTL: number = 3600, defaultStaleTime: number = 300) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.defaultStaleTime = defaultStaleTime;
    this.prewarm();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  getWithMeta<T>(key: string): { value: T | null; isStale: boolean } {
    const item = this.cache.get(key);
    if (!item) return { value: null, isStale: true };

    const now = Date.now();
    if (now > item.expiry) {
      this.cache.delete(key);
      return { value: null, isStale: true };
    }

    return {
      value: item.value as T,
      isStale: now > item.staleAt,
    };
  }

  set<T>(key: string, value: T, ttlSeconds: number = this.defaultTTL, staleSeconds: number = this.defaultStaleTime): void {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const now = Date.now();
    this.cache.set(key, {
      value,
      staleAt: now + (staleSeconds * 1000),
      expiry: now + (ttlSeconds * 1000),
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  /**
   * Pre-warms the in-memory cache with high-fidelity bundled snapshot data.
   * Guarantees 0ms cold-starts for SSR on all main routes.
   */
  public prewarm(): void {
    try {
      if (Array.isArray(seedPackages) && seedPackages.length > 0) {
        this.set('packages:all', seedPackages, 86400, 300);
      }
      if (Array.isArray(seedTours) && seedTours.length > 0) {
        this.set('tours:en', seedTours, 86400, 300);
        this.set('tours:mr', seedTours, 86400, 300);

        // Pre-warm individual tours by slug for instant /tours/:slug SSR
        for (const tour of seedTours) {
          if (tour.slug) {
            const slugKey = tour.slug.toLowerCase().trim();
            this.set(`tour:slug:${slugKey}:en`, tour, 86400, 300);
            this.set(`tour:slug:${slugKey}:mr`, tour, 86400, 300);
          }
        }
      }
      if (Array.isArray(seedTripOptions) && seedTripOptions.length > 0) {
        this.set('trip-options:all', seedTripOptions, 86400, 300);
      }
      if (Array.isArray(seedGallery) && seedGallery.length > 0) {
        this.set('gallery:all', seedGallery, 86400, 300);
      }
      if (Array.isArray(DEFAULT_GOOGLE_REVIEWS) && DEFAULT_GOOGLE_REVIEWS.length > 0) {
        this.set('reviews:all', DEFAULT_GOOGLE_REVIEWS, 86400, 600);
      }
    } catch (e) {
      console.warn('[Cache] Error during prewarm:', e);
    }
  }
}

// Export a singleton instance of the L1Cache
export const memoryCache = new L1Cache();
