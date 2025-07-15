import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
    firstName: z.string(),
    lastName: z.string()
  }),
  paymentMethod: z.string()
});

// Bestellungen abrufen
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Bestellungen abrufen Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Bestellungen' },
      { status: 500 }
    );
  }
}

// Neue Bestellung erstellen
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const body = await request.json();
    const { items, shippingAddress, paymentMethod } = createOrderSchema.parse(body);

    // Gesamtpreis berechnen
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Bestellung erstellen
    const order = await prisma.order.create({
      data: {
        userId: decoded.userId,
        totalAmount,
        status: 'PENDING',
        paymentMethod,
        shippingAddress: {
          create: shippingAddress
        },
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true
      }
    });

    return NextResponse.json({
      order,
      message: 'Bestellung erfolgreich erstellt'
    });

  } catch (error) {
    console.error('Bestellung erstellen Fehler:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Bestelldaten', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Bestellung' },
      { status: 500 }
    );
  }
}