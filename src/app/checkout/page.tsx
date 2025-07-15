import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CheckoutPage from '@/components/checkout/CheckoutPage';

export const metadata: Metadata = {
  title: 'Checkout | Innovate3D Labs',
  description: 'Schließen Sie Ihre Bestellung ab und wählen Sie Ihre bevorzugte Zahlungsmethode.',
};

export default function Checkout() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <CheckoutPage />
      </main>
      <Footer />
    </>
  );
}