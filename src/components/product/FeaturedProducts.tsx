'use client'

import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'
import { useAnalytics } from '@/lib/analytics'
import { notify } from '@/components/ui/NotificationSystem'
import ProductCard from './ProductCard'

const FeaturedProducts = () => {
  const { dispatch } = useCart()
  const { trackAddToCart } = useAnalytics()

  const products = [
    {
      id: 'printer-pro-x1',
      name: 'Innovate3D Pro X1',
      category: '3D Drucker',
      price: 2499,
      originalPrice: 2799,
      rating: 4.9,
      reviews: 127,
      image: '/images/products/printer-pro-x1.jpg',
      badge: 'Bestseller',
      badgeColor: 'from-apple-blue to-apple-purple',
      features: ['Präzision bis 0.1mm', 'Großer Bauraum', 'Auto-Leveling']
    },
    {
      id: 'filament-premium',
      name: 'Premium PLA+ Filament Set',
      category: 'Zubehör',
      price: 89,
      originalPrice: null,
      rating: 4.8,
      reviews: 89,
      image: '/images/products/filament-set.jpg',
      badge: 'Neu',
      badgeColor: 'from-apple-green to-apple-teal',
      features: ['10 Farben', 'Hochwertige Qualität', 'Umweltfreundlich']
    },
    {
      id: 'cabletree-classic',
      name: 'Classic Car Cabletree Kit',
      category: 'Cabletrees',
      price: 349,
      originalPrice: 399,
      rating: 5.0,
      reviews: 23,
      image: '/images/products/cabletree-classic.jpg',
      badge: 'Premium',
      badgeColor: 'from-apple-orange to-apple-red',
      features: ['Maßgeschneidert', 'OEM Qualität', 'Einfache Installation']
    },
    {
      id: 'printer-starter',
      name: 'Innovate3D Starter',
      category: '3D Drucker',
      price: 899,
      originalPrice: null,
      rating: 4.6,
      reviews: 45,
      image: '/images/products/printer-starter.jpg',
      badge: null,
      features: ['Einfache Bedienung', 'Kompakt', 'Ideal für Einsteiger']
    },
    {
      id: 'filament-basic',
      name: 'Basic PLA Filament',
      category: 'Zubehör',
      price: 19.99,
      originalPrice: null,
      rating: 4.5,
      reviews: 234,
      image: '/images/products/filament-basic.jpg',
      badge: null,
      features: ['1.75mm', 'Hohe Qualität', 'Verschiedene Farben']
    },
    {
      id: 'tool-kit',
      name: '3D Drucker Werkzeug Set',
      category: 'Zubehör',
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.7,
      reviews: 67,
      image: '/images/products/tool-kit.jpg',
      badge: 'Sale',
      badgeColor: 'from-red-500 to-red-600',
      features: ['Komplettes Set', 'Hochwertige Werkzeuge', 'Praktische Aufbewahrung']
    },
    {
      id: 'cabletree-modern',
      name: 'Modern Car Cabletree Kit',
      category: 'Cabletrees',
      price: 299,
      originalPrice: null,
      rating: 4.8,
      reviews: 15,
      image: '/images/products/cabletree-modern.jpg',
      badge: null,
      features: ['CAN-Bus kompatibel', 'Plug & Play', 'Deutsche Qualität']
    },
    {
      id: 'printer-pro-x2',
      name: 'Innovate3D Pro X2',
      category: '3D Drucker',
      price: 3499,
      originalPrice: 3999,
      rating: 4.9,
      reviews: 89,
      image: '/images/products/printer-pro-x2.jpg',
      badge: 'Limited Edition',
      badgeColor: 'from-purple-500 to-pink-500',
      features: ['Dual Extruder', 'Großer Bauraum', 'WiFi & Cloud']
    }
  ]

  // Handler for adding items to cart (not directly used in ProductCard but kept for reference)
  const handleAddToCart = (product: typeof products[0]) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      }
    })
    
    // Track analytics
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    })
    
    // Show notification
    notify.success('Zum Warenkorb hinzugefügt', `${product.name} wurde erfolgreich hinzugefügt.`, {
      action: {
        label: 'Warenkorb anzeigen',
        handler: () => window.location.href = '/cart'
      }
    })
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Beliebte Produkte
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie unsere meistverkauften und bestbewerteten Produkte
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                category={product.category}
                imageUrl={undefined} // No images as requested
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts