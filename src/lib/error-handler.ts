// Global error handling utilities
import { NextResponse } from 'next/server';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Error logger
export class ErrorLogger {
  static log(error: Error | AppError, context?: any) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
      }),
      context,
    };

    if (process.env.NODE_ENV === 'production') {
      // In production, send to monitoring service
      // TODO: Integrate with Sentry, LogRocket, etc.
      console.error(JSON.stringify(errorInfo));
    } else {
      // In development, pretty print
      console.error('🚨 Error:', errorInfo);
    }
  }
}

// API Error Response Handler
export function handleApiError(error: unknown, context?: string): NextResponse {
  ErrorLogger.log(error as Error, { context });

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(process.env.NODE_ENV !== 'production' && { details: error.details }),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        {
          error: {
            code: ErrorCode.CONFLICT,
            message: 'Ein Datensatz mit diesen Daten existiert bereits.',
          },
        },
        { status: 409 }
      );
    }
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        {
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Der angeforderte Datensatz wurde nicht gefunden.',
          },
        },
        { status: 404 }
      );
    }
  }

  // Default error response
  return NextResponse.json(
    {
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Ein interner Serverfehler ist aufgetreten.',
      },
    },
    { status: 500 }
  );
}

// Client-side error boundary component
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Ein unbekannter Fehler ist aufgetreten.';
} 