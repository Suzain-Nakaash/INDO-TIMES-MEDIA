import Redis from 'ioredis';
import { env } from './env';

let redis: Redis;

try {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      const delay = Math.min(times * 200, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err: Error) => {
    console.error('❌ Redis connection error:', err.message);
  });

  redis.on('close', () => {
    console.log('🔌 Redis connection closed');
  });
} catch (error) {
  console.error('❌ Failed to initialize Redis:', error);
  // Create a mock Redis that gracefully degrades
  redis = new Redis({ lazyConnect: true });
}

export { redis };

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (error) {
    console.warn('⚠️ Redis connection failed. Caching will be disabled:', (error as Error).message);
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    await redis.quit();
    console.log('🔌 Redis disconnected');
  } catch {
    // Ignore disconnect errors
  }
}

// ── Cache Helpers ──────────────────────────────────────────────

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Silently fail — caching is non-critical
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    // Silently fail
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Silently fail
  }
}
