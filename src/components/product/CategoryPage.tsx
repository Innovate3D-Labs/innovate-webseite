'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCart } from '@/lib/context/CartContext'
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface CategoryPageProps {
  category: string
  title: string
  description: string
}

const CategoryPage = ({ category, title, description }: CategoryPageProps) => {
  const [favorites, setFavorites] = useState<string[]>([])
  const { dispatch } = useCart()

  // Mock-Daten für die Kategorie
  const products = [
    {
      id: 'printer-pro-x1',
      name: 'Innovate3D Pro X1',
      category: '3D Drucker',
      price: 2499,
      originalPrice: 2799,
      rating: 4.8,
      reviews: 124,
      image: '/images/products/printer-1.jpg',
      badge: 'Bestseller',
      features: ['Automatisches Leveling', 'Dual Extruder', 'WiFi-Konnektivität']
    },
    {
      id: 'printer-starter',
      name: 'Innovate3D Starter',
      category: '3D Drucker',
      price: 899,
      rating: 4.6,
      reviews: 89,
      image: '/images/products/printer-2.jpg',
      badge: 'Einsteiger',
      features: ['Einfache Bedienung', 'Kompaktes Design', 'PLA-kompatibel']
    },
    {
      id: 'printer-industrial',
      name: 'Innovate3D Industrial',
      category: '3D Drucker',
      price: 4999,
      rating: 4.9,
      reviews: 67,
      image: '/images/products/printer-3.jpg',
      badge: 'Profi',
      features: ['Großer Bauraum', 'Hochtemperatur', 'Industriequalität']
    }
  ].filter(product => product.category === category)

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (product: any) => {
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
  }

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-apple-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sf-pro-display font-bold text-apple-gray-900 mb-6 tracking-tight">
              {title}
            </h1>
            <p className="text-xl text-apple-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-apple-lg transition-all duration-500 overflow-hidden">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-apple-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/placeholder.jpg'
                      }}
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 left-4 bg-apple-blue text-white px-3 py-1 rounded-full text-sm font-sf-pro-text font-medium">
                        {product.badge}
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-apple hover:bg-white transition-all duration-200"
                    >
                      {favorites.includes(product.id) ? (
                        <HeartIcon className="w-5 h-5 text-apple-red" />
                      ) : (
                        <HeartOutlineIcon className="w-5 h-5 text-apple-gray-600" />
                      )}
                    </button>
                    
                    {/* Quick Actions */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        In den Warenkorb
                      </Button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-sf-pro-text font-semibold text-apple-gray-900 mb-1 group-hover:text-apple-blue transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-apple-gray-600">{product.category}</p>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-apple-yellow'
                                : 'text-apple-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-apple-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <ul className="space-y-1">
                        {product.features.slice(0, 2).map((feature, i) => (
                          <li key={i} className="text-sm text-apple-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-apple-blue rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-sf-pro-display font-bold text-apple-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-apple-gray-500 line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <div className="bg-apple-red text-white px-2 py-1 rounded text-xs font-sf-pro-text font-medium">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CategoryPage