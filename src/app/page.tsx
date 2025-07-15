import Hero from '@/components/layout/Hero'
import Navigation from '@/components/layout/Navigation'
import ProductCategories from '@/components/product/ProductCategories'
import FeaturedProducts from '@/components/product/FeaturedProducts'
import Footer from '@/components/layout/Footer'
import SectionSeparator from '@/components/ui/SectionSeparator'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionSeparator spacing="lg" variant="gradient" />
      </div>
      
      <ProductCategories />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionSeparator spacing="lg" variant="line" />
      </div>
      
      <FeaturedProducts />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionSeparator spacing="xl" variant="dots" />
      </div>
      
      <Footer />
    </main>
  )
}