import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ProductCategories from '@/components/product/ProductCategories'
import FeaturedProducts from '@/components/product/FeaturedProducts'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alle Produkte | Innovate3D Labs',
  description: 'Entdecken Sie unser komplettes Sortiment an 3D-Druckern, Zubehör und Cabletree-Lösungen.',
}

export default function ProductsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-apple-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sf-pro-display font-bold text-apple-gray-900 mb-6 tracking-tight leading-none">
              Alle Produkte
            </h1>
            <p className="text-xl lg:text-2xl text-apple-gray-600 max-w-4xl mx-auto font-sf-pro-text leading-relaxed">
              Entdecken Sie unser komplettes Sortiment an innovativen 3D-Drucklösungen und maßgeschneiderten Cabletree-Produkten.
            </p>
          </div>
        </section>

        {/* Product Categories */}
        <ProductCategories />
        
        {/* Featured Products */}
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  )
}