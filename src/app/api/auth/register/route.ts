import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { stringifyPermissions } from '@/utils/json';
import { sendWelcomeEmail } from '@/lib/email';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  printerSerial: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, printerSerial } = registerSchema.parse(body);

    // Prüfen ob Benutzer bereits existiert
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Benutzer mit dieser E-Mail existiert bereits' },
        { status: 400 }
      );
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 12);

    // Benutzer erstellen
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
    });

    // Optional: Drucker-Konto erstellen falls Serial vorhanden
    if (printerSerial) {
      await createPrinterAccount(user.id, printerSerial);
    }

    // Willkommens-E-Mail senden
    try {
      await sendWelcomeEmail(email, firstName);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // E-Mail-Fehler sollten die Registrierung nicht blockieren
    }

    return NextResponse.json({
      message: 'Benutzer erfolgreich erstellt',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}

async function createPrinterAccount(userId: string, printerSerial: string) {
  let printer = await prisma.printer.findUnique({
    where: { serialNumber: printerSerial }
  });

  if (!printer) {
    printer = await prisma.printer.create({
      data: {
        serialNumber: printerSerial,
        model: 'Unbekannt',
        ownerId: userId,
        status: 'OFFLINE'
      }
    });
  }

  const permissions = printer.ownerId === userId 
    ? ['FULL_ACCESS'] 
    : ['VIEW_ONLY'];

  await prisma.printerAccount.create({
    data: {
      userId,
      printerId: printer.id,
      accountType: printer.ownerId === userId ? 'OWNER' : 'SHARED',
      permissions: stringifyPermissions(permissions)
    }
  });
}