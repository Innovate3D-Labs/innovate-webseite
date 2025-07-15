import { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import CartPage from '@/components/cart/CartPage'
import SectionSeparator from '@/components/ui/SectionSeparator'

export const metadata: Metadata = {
  title: 'Warenkorb | Innovate3D Labs',
  description: 'Überprüfen Sie Ihre ausgewählten Produkte und schließen Sie Ihre Bestellung ab.',
}

export default function Cart() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="sm" variant="none" />
        </div>
        
        <CartPage />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="lg" variant="gradient" />
        </div>
      </main>
      <Footer />
    </>
  )
}