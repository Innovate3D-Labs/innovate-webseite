// src/app/api/auth/register/route.ts
export async function POST(request: Request) {
  const { email, password, firstName, lastName, printerSerial } = await request.json();
  
  // Benutzer erstellen
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, firstName, lastName }
  });
  
  // Optional: Drucker-Konto erstellen falls Serial vorhanden
  if (printerSerial) {
    await createPrinterAccount(user.id, printerSerial);
  }
  
  return NextResponse.json({ user, message: 'Account created' });
}