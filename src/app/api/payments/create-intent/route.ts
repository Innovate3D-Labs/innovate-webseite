import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

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
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const body = await request.json();
    const { amount, currency, items } = createPaymentIntentSchema.parse(body);

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
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment Intent Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Zahlung' },
      { status: 500 }
    );
  }
}