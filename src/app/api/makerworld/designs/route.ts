import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags.length > 0) {
      where.tags = {
        hasEvery: tags,
      };
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'popular':
        orderBy = { likeCount: 'desc' };
        break;
      case 'downloads':
        orderBy = { downloadCount: 'desc' };
        break;
      case 'recent':
      default:
        orderBy = { publishedAt: 'desc' };
    }

    // Get total count
    const total = await prisma.design.count({ where });

    // Get designs
    const designs = await prisma.design.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        files: {
          where: {
            thumbnailUrl: { not: null },
          },
          take: 1,
          select: {
            thumbnailUrl: true,
          },
        },
      },
    });

    // Format response
    const formattedDesigns = designs.map((design) => ({
      ...design,
      thumbnailUrl: design.files[0]?.thumbnailUrl || null,
    }));

    return NextResponse.json({
      designs: formattedDesigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
} 