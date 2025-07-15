import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add CSP header in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https: blob:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.stripe.com wss://localhost:* ws://localhost:*; " +
      "frame-src 'self' https://js.stripe.com;"
    );
  }

  // CORS configuration for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    
    // Allow requests from allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Max-Age', '86400');
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  // Protect API routes that require authentication
  const protectedRoutes = [
    '/api/users',
    '/api/orders',
    '/api/admin',
    '/api/payments/create-intent',
    '/api/payments/confirm',
    '/api/makerworld/designs/upload',
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: { code: 'AUTHENTICATION_ERROR', message: 'Nicht autorisiert' } },
        { status: 401, headers: response.headers }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      // Add user ID to request headers for downstream use
      response.headers.set('X-User-Id', decoded.userId);
      
      // Check admin routes
      if (request.nextUrl.pathname.startsWith('/api/admin')) {
        // You would need to check if user is admin here
        // For now, we'll just pass through
      }
    } catch (error) {
      return NextResponse.json(
        { error: { code: 'AUTHENTICATION_ERROR', message: 'Ungültiger Token' } },
        { status: 401, headers: response.headers }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ['/api/users/:path*', '/api/orders/:path*', '/api/admin/:path*']
};