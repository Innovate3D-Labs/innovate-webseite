import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/email';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string()
  }),
  totalAmount: z.number().min(0),
  paymentMethod: z.string()
});

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const body = await request.json();
    const { paymentIntentId, items, shippingAddress, totalAmount, paymentMethod } = confirmPaymentSchema.parse(body);

    // Adresse erstellen oder finden
    const address = await prisma.address.create({
      data: {
        ...shippingAddress,
        userId: decoded.userId,
      }
    });

    // Bestellung erstellen
    const order = await prisma.order.create({
      data: {
        totalAmount,
        status: 'PROCESSING',
        paymentMethod,
        userId: decoded.userId,
        addressId: address.id,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Bestellbestätigung per E-Mail senden
    try {
      const orderData = {
        id: order.id,
        customerName: `${order.user.firstName} ${order.user.lastName}`,
        total: order.totalAmount,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        items: order.items.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      await sendOrderConfirmation(order.user.email, orderData);
    } catch (emailError) {
      console.error('Failed to send order confirmation:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      message: 'Zahlung bestätigt und Bestellung erstellt' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Zahlungsbestätigung' },
      { status: 500 }
    );
  }
}