import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { memoryCache } from '@/backend/shared/memory-cache';

// Load .env variables manually in Node environment if not loaded
async function loadEnv() {
  if (typeof window === "undefined") {
    try {
      const path = await import(/* @vite-ignore */ 'node:' + 'path');
      const fs = await import(/* @vite-ignore */ 'node:' + 'fs');
      const envPath = path.join(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        envContent.split(/\r?\n/).forEach((line: string) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const firstEq = trimmed.indexOf("=");
            if (firstEq !== -1) {
              const key = trimmed.substring(0, firstEq).trim();
              let val = trimmed.substring(firstEq + 1).trim();
              if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1);
              } else if (val.startsWith("'") && val.endsWith("'")) {
                val = val.slice(1, -1);
              }
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("Error loading .env for Redis", e);
    }
  }
}
// Execute it but do not block, as this is top level.
loadEnv().catch(console.error);

let redisClient: Redis | null = null;
let isRedisAvailable = false;
let consecutiveFailures = 0;
const MAX_FAILURES = 2;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

// Avoid initializing if missing, empty, or placeholder
if (redisUrl && redisToken && !redisUrl.includes("placeholder") && !redisUrl.startsWith("#")) {
  try {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    isRedisAvailable = true;
    console.log("[Redis] Upstash Redis client initialized.");
  } catch (e: any) {
    console.warn("[Redis] Failed to initialize Upstash Redis:", e?.message || e);
    redisClient = null;
    isRedisAvailable = false;
  }
} else {
  console.log("[Cache] Remote Redis not configured. Using in-memory L1 cache.");
}

function handleRedisError(action: string, key: string, error: any) {
  consecutiveFailures++;
  const errorMsg = error?.message || String(error);
  const errorCode = error?.cause?.code || error?.code || '';
  const isNetworkOrDns = 
    errorCode === 'ENOTFOUND' ||
    errorCode === 'ECONNREFUSED' ||
    errorCode === 'ETIMEDOUT' ||
    errorMsg.includes('fetch failed') ||
    errorMsg.includes('ENOTFOUND');

  if (isRedisAvailable && (isNetworkOrDns || consecutiveFailures >= MAX_FAILURES)) {
    isRedisAvailable = false;
    console.warn(`[Redis] Connection failed (${errorCode || errorMsg}). Automatically disabling remote Redis and falling back to in-memory L1 cache.`);
  } else if (isRedisAvailable) {
    console.warn(`[Redis] ${action} error for key "${key}":`, errorMsg);
  }
}

// Safe wrapper around Redis for direct consumers (e.g. reviews.ts)
const safeRedisProxy: Redis | null = redisClient
  ? (new Proxy(redisClient, {
      get(target: any, prop: string | symbol) {
        const original = target[prop];
        if (typeof original === 'function') {
          return async (...args: any[]) => {
            if (!isRedisAvailable) return null;
            try {
              const result = await original.apply(target, args);
              consecutiveFailures = 0;
              return result;
            } catch (err) {
              handleRedisError(String(prop).toUpperCase(), String(args[0] || ''), err);
              return null;
            }
          };
        }
        return original;
      },
    }) as unknown as Redis)
  : null;

export const redis = safeRedisProxy;

// Define rate limiters
export const rateLimiters = {
  api: (redisClient && isRedisAvailable)
    ? new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(50, "10 s"),
        analytics: true,
      })
    : null,
  login: (redisClient && isRedisAvailable)
    ? new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        analytics: true,
      })
    : null,
  booking: (redisClient && isRedisAvailable)
    ? new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(10, "1 h"),
        analytics: true,
      })
    : null,
};

export async function getCachedData<T>(key: string): Promise<T | null> {
  // 1. Check L1 Memory Cache (Fastest)
  const l1Data = memoryCache.get<T>(key);
  if (l1Data !== null) {
    return l1Data;
  }

  // 2. Check L2 Redis Cache
  if (!redisClient || !isRedisAvailable) return null;
  try {
    const data = await redisClient.get<T>(key);
    if (data !== null) {
      // Backfill L1 Cache from Redis
      memoryCache.set(key, data);
    }
    consecutiveFailures = 0;
    return data;
  } catch (error) {
    handleRedisError('GET', key, error);
    return null;
  }
}

export async function setCachedData(key: string, data: any, ex: number = 300): Promise<void> {
  // Set in L1 Memory Cache
  memoryCache.set(key, data, ex);

  if (!redisClient || !isRedisAvailable) return;
  try {
    await redisClient.set(key, data, { ex });
    consecutiveFailures = 0;
  } catch (error) {
    handleRedisError('SET', key, error);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  memoryCache.delete(key);

  if (!redisClient || !isRedisAvailable) return;
  try {
    await redisClient.del(key);
    consecutiveFailures = 0;
  } catch (error) {
    handleRedisError('DEL', key, error);
  }
}
