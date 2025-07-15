import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['.stl', '.obj', '.3mf', '.ply'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: STL, OBJ, 3MF, PLY' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      );
    }

    // Mock file upload - in production, upload to cloud storage
    const fileUrl = `/uploads/designs/${Date.now()}_${file.name}`;
    
    // Mock design creation - in production, save to database
    const design = {
      id: Date.now().toString(),
      title,
      description: description || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fileUrl,
      thumbnailUrl: null,
      status: 'PUBLISHED',
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

    return NextResponse.json({ 
      design,
      message: 'Design uploaded successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading design:', error);
    return NextResponse.json(
      { error: 'Failed to upload design' },
      { status: 500 }
    );
  }
} 