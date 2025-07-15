import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CheckoutPage from '@/components/checkout/CheckoutPage';
import SectionSeparator from '@/components/ui/SectionSeparator';

export const metadata: Metadata = {
  title: 'Checkout | Innovate3D Labs',
  description: 'Schließen Sie Ihre Bestellung ab und wählen Sie Ihre bevorzugte Zahlungsmethode.',
};

export default function Checkout() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="sm" variant="none" />
        </div>
        
        <CheckoutPage />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="xl" variant="dots" />
        </div>
      </main>
      <Footer />
    </>
  );
}