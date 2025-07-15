import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY ist nicht in den Umgebungsvariablen definiert');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any,
});

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100); // Konvertiert Euro zu Cent
};

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100; // Konvertiert Cent zu Euro
};
