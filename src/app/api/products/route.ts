import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { handleApiError } from '@/lib/error-handler';
import { rateLimiters } from '@/lib/rate-limiter';
import { getCachedProducts } from '@/lib/cache';

const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    await rateLimiters.public(request);

    const { searchParams } = new URL(request.url);
    const query = productQuerySchema.parse(Object.fromEntries(searchParams));
    
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '12');
    
    // Use cached products
    const params = {
      page,
      limit,
      category: query.category,
      search: query.search,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
    };

    const { products, total } = await getCachedProducts(params);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    return handleApiError(error, 'products.get');
  }
}