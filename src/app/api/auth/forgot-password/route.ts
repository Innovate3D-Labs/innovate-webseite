import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Benutzer finden
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Immer success zurückgeben (Security: keine E-Mail-Enumeration)
    if (!user) {
      return NextResponse.json({ 
        message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine Reset-E-Mail gesendet.' 
      });
    }

    // Reset-Token generieren
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExp = new Date(Date.now() + 3600000); // 1 Stunde

    // Token in Datenbank speichern
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp,
      },
    });

    // E-Mail senden
    await sendPasswordResetEmail(email, resetToken, user.firstName);

    return NextResponse.json({ 
      message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine Reset-E-Mail gesendet.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}