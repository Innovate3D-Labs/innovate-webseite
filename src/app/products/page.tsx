import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import FeaturedProducts from '@/components/product/FeaturedProducts'
import SectionSeparator from '@/components/ui/SectionSeparator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alle Produkte | Innovate3D Labs',
  description: 'Entdecken Sie unser komplettes Sortiment an 3D-Druckern, Zubehör und Cabletree-Lösungen.',
}

export default function ProductsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Alle Produkte</h1>
          <p className="text-lg text-gray-600">
            Entdecken Sie unser komplettes Sortiment an 3D-Druckern, Zubehör und innovativen Lösungen.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="md" variant="gradient" />
        </div>
        
        {/* Featured Products */}
        <FeaturedProducts />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="xl" variant="line" />
        </div>
      </main>
      <Footer />
    </>
  )
}