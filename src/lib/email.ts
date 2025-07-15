import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Basis E-Mail Template
function getEmailTemplate(title: string, content: string, buttonText?: string, buttonUrl?: string) {
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 20px; }
        .button { display: inline-block; background: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Innovate3D Labs</h1>
        </div>
        <div class="content">
          ${content}
          ${buttonText && buttonUrl ? `<div style="text-align: center;"><a href="${buttonUrl}" class="button">${buttonText}</a></div>` : ''}
        </div>
        <div class="footer">
          <p>© 2024 Innovate3D Labs. Alle Rechte vorbehalten.</p>
          <p>Bei Fragen kontaktieren Sie uns unter ${process.env.FROM_EMAIL}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Passwort-Reset E-Mail
export async function sendPasswordResetEmail(email: string, resetToken: string, firstName: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;
  
  const content = `
    <h2>Passwort zurücksetzen</h2>
    <p>Hallo ${firstName},</p>
    <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen:</p>
    <p><strong>Dieser Link ist 1 Stunde gültig.</strong></p>
    <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
  `;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Passwort zurücksetzen - Innovate3D Labs',
    html: getEmailTemplate('Passwort zurücksetzen', content, 'Passwort zurücksetzen', resetUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

// Verbesserte Bestellbestätigung
export async function sendOrderConfirmation(email: string, orderData: any) {
  const content = `
    <h2>Vielen Dank für Ihre Bestellung!</h2>
    <p>Hallo ${orderData.customerName},</p>
    <p>Ihre Bestellung wurde erfolgreich aufgegeben und wird bearbeitet.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Bestelldetails</h3>
      <p><strong>Bestellnummer:</strong> #${orderData.id}</p>
      <p><strong>Bestelldatum:</strong> ${new Date(orderData.createdAt).toLocaleDateString('de-DE')}</p>
      <p><strong>Gesamtbetrag:</strong> €${orderData.total.toFixed(2)}</p>
      <p><strong>Zahlungsmethode:</strong> ${orderData.paymentMethod}</p>
    </div>
    
    <h3>Bestellte Artikel</h3>
    ${orderData.items.map((item: any) => `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <strong>${item.productName}</strong><br>
        Menge: ${item.quantity} × €${item.price.toFixed(2)} = €${(item.quantity * item.price).toFixed(2)}
      </div>
    `).join('')}
    
    <p style="margin-top: 30px;">Wir werden Sie über den Versandstatus per E-Mail informieren.</p>
  `;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `Bestellbestätigung #${orderData.id} - Innovate3D Labs`,
    html: getEmailTemplate('Bestellbestätigung', content, 'Bestellung verfolgen', `${process.env.NEXT_PUBLIC_BASE_URL}/profile?tab=orders`),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
}

// Willkommens-E-Mail
export async function sendWelcomeEmail(email: string, firstName: string) {
  const content = `
    <h2>Willkommen bei Innovate3D Labs!</h2>
    <p>Hallo ${firstName},</p>
    <p>Vielen Dank für Ihre Registrierung! Ihr Konto wurde erfolgreich erstellt.</p>
    <p>Sie können jetzt:</p>
    <ul>
      <li>Unsere 3D-Drucker und Zubehör durchstöbern</li>
      <li>Bestellungen aufgeben und verfolgen</li>
      <li>Ihr Profil und Ihre Einstellungen verwalten</li>
      <li>Exklusive Angebote und Updates erhalten</li>
    </ul>
    <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung!</p>
  `;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Willkommen bei Innovate3D Labs!',
    html: getEmailTemplate('Willkommen!', content, 'Jetzt einkaufen', `${process.env.NEXT_PUBLIC_BASE_URL}/products`),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}