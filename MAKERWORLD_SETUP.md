# MakerWorld Setup Guide

## Overview
MakerWorld is a community platform integrated into the Innovate OS website where users can upload, share, and download 3D design files. This feature is similar to platforms like Thingiverse or Printables.

## Features
- **Upload Designs**: Users can upload STL, OBJ, GLTF, and STEP files
- **Share with Community**: Publish designs with descriptions, tags, and print settings
- **Interactive Elements**: Like, comment, and download designs
- **User Collections**: Organize favorite designs
- **Remix Support**: Credit original creators when remixing designs
- **User Isolation**: Each user only sees and manages their own uploads

## Database Integration

### 1. Environment Setup

Copy the `.env.example` file to `.env` and configure:

```bash
# Database - Connect to existing Innovate OS PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/innovate_os"

# S3/MinIO Storage - Uses existing MinIO from server setup
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin"
S3_BUCKET_NAME="innovate-designs"
```

### 2. Database Migration

The website now uses PostgreSQL (matching the backend). Run these commands to set up the database:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate --schema=./generated/prisma/schema.prisma

# Run database migrations
npx prisma migrate dev --schema=./generated/prisma/schema.prisma --name makerworld_init

# Seed initial data (optional)
npx prisma db seed --schema=./generated/prisma/schema.prisma
```

### 3. Create S3 Bucket

Create the bucket for storing 3D files:

```bash
# Using MinIO client
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/innovate-designs
mc policy set public local/innovate-designs
```

## New Database Models

### Design Model
- Stores 3D design metadata
- Links to user who created it
- Tracks views, downloads, and likes
- Supports tags for categorization
- Includes print settings recommendations

### DesignFile Model
- Stores individual files for each design
- Supports multiple file types (STL, GCODE, etc.)
- Tracks file size and thumbnails
- Links to S3 storage

### Comment & Like Models
- Enable community interaction
- Support nested comments
- Track user engagement

### Collection Model
- Users can organize designs into collections
- Public/private visibility options

## API Endpoints

### Public Endpoints
- `GET /api/makerworld/designs` - Browse all public designs
- `GET /api/makerworld/designs/[id]` - View design details

### Authenticated Endpoints
- `POST /api/makerworld/designs/upload` - Upload new design
- `POST /api/makerworld/designs/[id]/like` - Like/unlike design
- `POST /api/makerworld/designs/[id]/comments` - Add comment
- `POST /api/makerworld/designs/[id]/download` - Download design (tracks stats)

## User Isolation & Security

### How User Isolation Works:
1. **Authentication**: Users must be logged in to upload designs
2. **User Association**: Each design is linked to the user who uploaded it via `userId`
3. **Query Filtering**: API automatically filters by user context
4. **Access Control**: Users can only edit/delete their own designs
5. **Public Sharing**: Designs marked as "PUBLISHED" are visible to all

### Example:
When user "tom567" uploads "test.stl":
- Design record created with `userId: "tom567-uuid"`
- File stored in S3 at `designs/[design-id]/[file-id].stl`
- Other users can view/download if published
- Only tom567 can edit/delete the design

## Integration with Backend

The website now connects to the same PostgreSQL database as the backend API. This enables:

1. **Unified User Management**: Same users across backend and website
2. **Print Job Integration**: Designs can be sent directly to printers
3. **Cloud Sync**: Designs sync with cloud storage
4. **Real-time Updates**: WebSocket notifications for comments/likes

## Development Workflow

1. **Start PostgreSQL and MinIO**:
   ```bash
   cd server
   docker-compose up -d postgres redis minio
   ```

2. **Run the website**:
   ```bash
   cd "neue webseite"
   npm run dev
   ```

3. **Access MakerWorld**:
   - Navigate to http://localhost:3000/makerworld
   - Sign up/sign in to upload designs
   - Browse community designs without authentication

## Production Deployment

1. **Database**: Use the production PostgreSQL instance
2. **Storage**: Configure production S3 or MinIO
3. **Environment**: Update all URLs and credentials
4. **SSL**: Ensure HTTPS for secure file uploads
5. **CDN**: Consider CDN for serving 3D file previews

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### File Upload Issues
- Verify MinIO/S3 is accessible
- Check bucket permissions
- Ensure file size limits are configured

### Authentication Issues
- Check NextAuth configuration
- Verify JWT secret is set
- Ensure user has username field populated 