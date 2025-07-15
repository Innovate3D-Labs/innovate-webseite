import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Protect API routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/users') || 
      request.nextUrl.pathname.startsWith('/api/orders') ||
      request.nextUrl.pathname.startsWith('/api/admin')) {
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      return NextResponse.json(
        { error: 'Ungültiger Token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/users/:path*', '/api/orders/:path*', '/api/admin/:path*']
};