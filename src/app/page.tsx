import Hero from '@/components/layout/Hero'
import Navigation from '@/components/layout/Navigation'
import ProductCategories from '@/components/product/ProductCategories'
import FeaturedProducts from '@/components/product/FeaturedProducts'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ProductCategories />
      <FeaturedProducts />
      <Footer />
    </main>
  )
}