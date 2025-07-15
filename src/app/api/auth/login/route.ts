import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { handleApiError, AppError, ErrorCode } from '@/lib/error-handler';
import { rateLimiters } from '@/lib/rate-limiter';
import { analytics, AnalyticsEvent } from '@/lib/analytics';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await rateLimiters.auth(request);

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Benutzer finden
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        printerAccounts: {
          include: {
            printer: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError(
        ErrorCode.AUTHENTICATION_ERROR,
        'Ungültige Anmeldedaten',
        401
      );
    }

    // Passwort prüfen
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(
        ErrorCode.AUTHENTICATION_ERROR,
        'Ungültige Anmeldedaten',
        401
      );
    }

    // JWT Token erstellen
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Benutzer-Daten ohne Passwort
    const { password: _, ...userWithoutPassword } = user;

    // Track successful login
    analytics.track(AnalyticsEvent.USER_LOGIN, {
      userId: user.id,
      email: user.email
    });

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Erfolgreich angemeldet'
    });

  } catch (error) {
    return handleApiError(error, 'login');
  }
}