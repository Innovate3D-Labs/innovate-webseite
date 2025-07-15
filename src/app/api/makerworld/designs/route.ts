import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags') || '';
    const sortBy = searchParams.get('sortBy') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock data for now - in production, fetch from database
    const mockDesigns = [
      {
        id: '1',
        title: 'Phone Stand',
        description: 'Adjustable phone stand for desk use',
        thumbnailUrl: null,
        user: {
          id: 'user1',
          username: 'maker1',
          firstName: 'John',
          lastName: 'Doe',
          avatarUrl: null
        },
        viewCount: 125,
        downloadCount: 45,
        likeCount: 23,
        tags: ['functional', 'desk'],
        publishedAt: new Date('2024-01-15').toISOString(),
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString()
      },
      {
        id: '2',
        title: 'Miniature Dragon',
        description: 'Detailed dragon figurine for decoration',
        thumbnailUrl: null,
        user: {
          id: 'user2',
          username: 'artist3d',
          firstName: 'Jane',
          lastName: 'Smith',
          avatarUrl: null
        },
        viewCount: 89,
        downloadCount: 32,
        likeCount: 18,
        tags: ['art', 'miniature'],
        publishedAt: new Date('2024-01-10').toISOString(),
        createdAt: new Date('2024-01-10').toISOString(),
        updatedAt: new Date('2024-01-10').toISOString()
      }
    ];

    // Filter designs based on search and tags
    let filteredDesigns = mockDesigns;

    if (search) {
      filteredDesigns = filteredDesigns.filter(design =>
        design.title.toLowerCase().includes(search.toLowerCase()) ||
        design.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (tags) {
      const tagArray = tags.split(',').filter(Boolean);
      filteredDesigns = filteredDesigns.filter(design =>
        tagArray.some(tag => design.tags.includes(tag))
      );
    }

    // Sort designs
    switch (sortBy) {
      case 'popular':
        filteredDesigns.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'downloads':
        filteredDesigns.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'recent':
      default:
        filteredDesigns.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDesigns = filteredDesigns.slice(startIndex, endIndex);

    return NextResponse.json({
      designs: paginatedDesigns,
      pagination: {
        page,
        limit,
        total: filteredDesigns.length,
        totalPages: Math.ceil(filteredDesigns.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, tags, fileUrl } = body;

    // Mock design creation - in production, save to database
    const newDesign = {
      id: Date.now().toString(),
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      fileUrl,
      thumbnailUrl: null,
      user: {
        id: 'current_user',
        username: 'current_user',
        firstName: 'Current',
        lastName: 'User',
        avatarUrl: null
      },
      viewCount: 0,
      downloadCount: 0,
      likeCount: 0,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ design: newDesign }, { status: 201 });

  } catch (error) {
    console.error('Error creating design:', error);
    return NextResponse.json(
      { error: 'Failed to create design' },
      { status: 500 }
    );
  }
} 