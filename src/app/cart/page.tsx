import { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import CartPage from '@/components/cart/CartPage'

export const metadata: Metadata = {
  title: 'Warenkorb | Innovate3D Labs',
  description: 'Überprüfen Sie Ihre ausgewählten Produkte und schließen Sie Ihre Bestellung ab.',
}

export default function Cart() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <CartPage />
      </main>
      <Footer />
    </>
  )
}