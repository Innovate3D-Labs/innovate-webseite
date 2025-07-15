import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    // Mock orders data - in production, fetch from database with proper auth
    const mockOrders = [
      {
        id: '1',
        userId: 'user_123',
        totalAmount: 299.99,
        status: 'DELIVERED',
        paymentMethod: 'CARD',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString(),
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          street: 'Musterstraße 123',
          city: 'Berlin',
          postalCode: '10115',
          country: 'Deutschland'
        },
        items: [
          {
            id: '1',
            productId: 'printer-starter',
            quantity: 1,
            price: 299.99,
            product: {
              name: 'Innovate3D Starter',
              image: '/images/products/printer-starter.jpg'
            }
          }
        ]
      },
      {
        id: '2',
        userId: 'user_123',
        totalAmount: 89.99,
        status: 'SHIPPED',
        paymentMethod: 'PAYPAL',
        createdAt: new Date('2024-01-10').toISOString(),
        updatedAt: new Date('2024-01-12').toISOString(),
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          street: 'Musterstraße 123',
          city: 'Berlin',
          postalCode: '10115',
          country: 'Deutschland'
        },
        items: [
          {
            id: '2',
            productId: 'filament-premium',
            quantity: 3,
            price: 29.99,
            product: {
              name: 'Premium PLA+ Filament',
              image: '/images/products/filament-set.jpg'
            }
          }
        ]
      }
    ];

    return NextResponse.json({ orders: mockOrders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Mock order creation - in production, save to database
    const newOrder = {
      id: Date.now().toString(),
      userId: 'user_123', // In production, get from JWT token
      totalAmount,
      status: 'PENDING',
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress,
      items: items.map((item: any, index: number) => ({
        id: (Date.now() + index).toString(),
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: {
          name: item.productName || 'Product',
          image: item.productImage || '/images/products/default.jpg'
        }
      }))
    };

    return NextResponse.json({ 
      order: newOrder,
      message: 'Order created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}