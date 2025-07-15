import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { AppError, ErrorCode, handleApiError } from '@/lib/error-handler';
import { rateLimiters } from '@/lib/rate-limiter';

const createPaymentIntentSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default('eur'),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number()
  }))
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await rateLimiters.payment(request);

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new AppError(
        ErrorCode.AUTHENTICATION_ERROR,
        'Nicht autorisiert',
        401
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const body = await request.json();
    const { amount, currency, items } = createPaymentIntentSchema.parse(body);

    // Validate amount
    if (amount < 1) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Der Betrag muss mindestens 1 EUR betragen',
        400
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount),
      currency,
      metadata: {
        userId: decoded.userId,
        items: JSON.stringify(items)
      },
      automatic_payment_methods: {
        enabled: true,
      },
      description: `Bestellung für ${items.length} Artikel(n)`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    return handleApiError(error, 'payment.createIntent');
  }
}