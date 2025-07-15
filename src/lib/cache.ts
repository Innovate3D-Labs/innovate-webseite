// Advanced caching system for performance optimization
import { prisma } from './prisma';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  staleWhileRevalidate?: boolean;
  tags?: string[];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  stale?: boolean;
}

class CacheStore {
  private store = new Map<string, CacheEntry<any>>();
  private tagIndex = new Map<string, Set<string>>();

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl || 3600, // Default 1 hour
      tags: options.tags || [],
    };

    this.store.set(key, entry);

    // Update tag index
    entry.tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    const now = Date.now();
    const age = (now - entry.timestamp) / 1000; // Age in seconds

    if (age > entry.ttl) {
      if (!entry.stale) {
        // Mark as stale for stale-while-revalidate
        entry.stale = true;
      } else {
        // Remove if already marked as stale
        this.delete(key);
        return null;
      }
    }

    return entry.data;
  }

  delete(key: string): void {
    const entry = this.store.get(key);
    if (entry) {
      // Remove from tag index
      entry.tags.forEach(tag => {
        const keys = this.tagIndex.get(tag);
        if (keys) {
          keys.delete(key);
          if (keys.size === 0) {
            this.tagIndex.delete(tag);
          }
        }
      });
    }
    this.store.delete(key);
  }

  invalidateTag(tag: string): void {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      keys.forEach(key => this.delete(key));
    }
  }

  clear(): void {
    this.store.clear();
    this.tagIndex.clear();
  }

  size(): number {
    return this.store.size;
  }

  isStale(key: string): boolean {
    const entry = this.store.get(key);
    return entry?.stale || false;
  }
}

// Global cache instance
const cache = new CacheStore();

// Cache key generators
export const cacheKeys = {
  product: (id: string) => `product:${id}`,
  products: (params: any) => `products:${JSON.stringify(params)}`,
  user: (id: string) => `user:${id}`,
  order: (id: string) => `order:${id}`,
  design: (id: string) => `design:${id}`,
  designs: (params: any) => `designs:${JSON.stringify(params)}`,
};

// Cache decorators for common queries
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Check cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    // If stale-while-revalidate is enabled, revalidate in background
    if (options.staleWhileRevalidate && cache.isStale(key)) {
      queryFn().then(data => {
        cache.set(key, data, options);
      }).catch(console.error);
    }
    return cached;
  }

  // Execute query and cache result
  const data = await queryFn();
  cache.set(key, data, options);
  return data;
}

// Product caching
export async function getCachedProduct(id: string) {
  return cachedQuery(
    cacheKeys.product(id),
    () => prisma.product.findUnique({ where: { id } }),
    { ttl: 3600, tags: ['products'] }
  );
}

export async function getCachedProducts(params: any) {
  return cachedQuery(
    cacheKeys.products(params),
    async () => {
      const { page = 1, limit = 12, category, search, minPrice, maxPrice } = params;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (category) where.category = category;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = minPrice;
        if (maxPrice) where.price.lte = maxPrice;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where })
      ]);

      return { products, total };
    },
    { ttl: 300, tags: ['products'], staleWhileRevalidate: true }
  );
}

// Cache invalidation helpers
export function invalidateProductCache() {
  cache.invalidateTag('products');
}

export function invalidateUserCache(userId: string) {
  cache.delete(cacheKeys.user(userId));
}

export function invalidateOrderCache(orderId: string) {
  cache.delete(cacheKeys.order(orderId));
}

// Redis adapter for distributed caching (optional)
export interface CacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// In-memory adapter (default)
export class InMemoryCacheAdapter implements CacheAdapter {
  private cache = new CacheStore();

  async get<T>(key: string): Promise<T | null> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.cache.set(key, value, { ttl });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// Export cache instance for direct access
export { cache }; 