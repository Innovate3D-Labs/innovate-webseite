import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const layerHeight = parseFloat(formData.get('layerHeight') as string) || null;
    const infillPercent = parseInt(formData.get('infillPercent') as string) || null;
    const printTime = parseInt(formData.get('printTime') as string) || null;
    const filamentUsage = parseFloat(formData.get('filamentUsage') as string) || null;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + uuidv4().split('-')[0];

    // Create design record
    const design = await prisma.design.create({
      data: {
        title,
        description,
        slug,
        tags,
        layerHeight,
        infillPercent,
        printTime,
        filamentUsage,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        userId: session.user.id,
      },
    });

    // Process model files
    const modelFiles = formData.getAll('modelFiles') as File[];
    const imageFiles = formData.getAll('imageFiles') as File[];

    // Upload files to S3
    const uploadedFiles = [];
    
    // Upload model files
    for (const file of modelFiles) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const fileKey = `designs/${design.id}/${uuidv4()}.${fileExtension}`;
      
      const buffer = Buffer.from(await file.arrayBuffer());
      
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: fileKey,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${fileKey}`;
      
      const designFile = await prisma.designFile.create({
        data: {
          designId: design.id,
          fileName: file.name,
          fileType: fileExtension.toUpperCase(),
          fileSize: file.size,
          fileUrl,
        },
      });
      
      uploadedFiles.push(designFile);
    }

    // Upload and process image files
    for (const file of imageFiles) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const fileKey = `designs/${design.id}/images/${uuidv4()}.${fileExtension}`;
      const thumbnailKey = `designs/${design.id}/thumbnails/${uuidv4()}.${fileExtension}`;
      
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Upload original image
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: fileKey,
          Body: buffer,
          ContentType: file.type,
        })
      );

      // For simplicity, using the same image as thumbnail
      // In production, you'd resize the image
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: thumbnailKey,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${fileKey}`;
      const thumbnailUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${thumbnailKey}`;
      
      await prisma.designFile.create({
        data: {
          designId: design.id,
          fileName: file.name,
          fileType: 'IMAGE',
          fileSize: file.size,
          fileUrl,
          thumbnailUrl,
        },
      });
    }

    return NextResponse.json({
      designId: design.id,
      message: 'Design uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading design:', error);
    return NextResponse.json(
      { error: 'Failed to upload design' },
      { status: 500 }
    );
  }
} 