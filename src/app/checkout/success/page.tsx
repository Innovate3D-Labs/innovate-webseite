import { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess'

export const metadata: Metadata = {
  title: 'Bestellung erfolgreich - Innovate3D Labs',
  description: 'Ihre Bestellung wurde erfolgreich aufgegeben',
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <CheckoutSuccess />
      </main>
      <Footer />
    </>
  )
}