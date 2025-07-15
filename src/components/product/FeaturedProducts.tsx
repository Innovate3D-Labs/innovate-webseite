'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useCart } from '@/lib/context/CartContext'

const FeaturedProducts = () => {
  const [favorites, setFavorites] = useState<string[]>([])
  const { dispatch } = useCart()

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
    }
  ]

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (product: typeof products[0]) => {
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

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="text-5xl sm:text-6xl lg:text-7xl font-sf-pro-display font-bold text-apple-gray-900 mb-6 tracking-tight leading-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            Beliebte Produkte
          </motion.h2>
          <motion.p 
            className="text-xl lg:text-2xl text-apple-gray-600 max-w-4xl mx-auto font-sf-pro-text leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            Entdecken Sie unsere meistverkauften und bestbewerteten Produkte, 
            die von Kunden weltweit geschätzt werden.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => {
            const isFavorite = favorites.includes(product.id)
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div 
                  className="bg-white rounded-3xl overflow-hidden shadow-apple hover:shadow-apple-lg transition-all duration-500 ease-apple h-full"
                  whileHover={{ 
                    y: -12,
                    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                >
                  {/* Product Image */}
                  <div className="relative h-80 bg-apple-gray-100 overflow-hidden">
                    {/* Placeholder for product image */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-apple-gray-50 to-apple-gray-100 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <span className="text-apple-gray-400 font-sf-pro-text text-lg">Produktbild</span>
                    </motion.div>
                    
                    {/* Badge */}
                    {product.badge && (
                      <motion.div 
                        className={`absolute top-6 left-6 bg-gradient-to-r ${product.badgeColor} text-white px-4 py-2 rounded-full font-sf-pro-text font-medium text-sm shadow-apple-sm`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        {product.badge}
                      </motion.div>
                    )}
                    
                    {/* Favorite Button */}
                    <motion.button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-6 right-6 p-3 bg-apple-glass backdrop-blur-md rounded-full hover:bg-white/90 transition-all duration-300 ease-apple shadow-apple-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <motion.div
                        animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isFavorite ? (
                          <HeartIcon className="w-5 h-5 text-apple-red" />
                        ) : (
                          <HeartOutlineIcon className="w-5 h-5 text-apple-gray-600" />
                        )}
                      </motion.div>
                    </motion.button>
                    
                    {/* Quick Actions */}
                    <motion.div 
                      className="absolute inset-0 bg-black/20 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <motion.button 
                        onClick={() => addToCart(product)}
                        className="bg-white text-apple-gray-900 px-8 py-4 rounded-full font-sf-pro-text font-medium hover:bg-apple-gray-50 transition-all duration-300 ease-apple flex items-center shadow-apple-lg backdrop-blur-sm"
                        initial={{ scale: 0, y: 20 }}
                        whileHover={{ scale: 1, y: 0 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <ShoppingCartIcon className="w-5 h-5 mr-3" />
                        In den Warenkorb
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-8 lg:p-10">
                    <motion.div 
                      className="text-sm text-apple-blue font-sf-pro-text font-medium mb-3 tracking-wide uppercase"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {product.category}
                    </motion.div>
                    
                    <h3 className="text-2xl lg:text-3xl font-sf-pro-display font-bold text-apple-gray-900 mb-4 tracking-tight group-hover:text-apple-blue transition-colors duration-300 ease-apple">
                      <Link href={`/products/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <StarIcon 
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating) 
                                  ? 'text-apple-yellow' 
                                  : 'text-apple-gray-300'
                              }`} 
                            />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-apple-gray-600 font-sf-pro-text ml-3 text-lg">
                        {product.rating} ({product.reviews} Bewertungen)
                      </span>
                    </div>
                    
                    {/* Features */}
                    <ul className="text-apple-gray-600 font-sf-pro-text mb-6 space-y-3">
                      {product.features.map((feature, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-center text-lg"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                          viewport={{ once: true }}
                        >
                          <span className="w-2 h-2 bg-apple-blue rounded-full mr-4 flex-shrink-0"></span>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl lg:text-4xl font-sf-pro-display font-bold text-apple-gray-900">
                          €{formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xl text-apple-gray-500 line-through font-sf-pro-text">
                            €{formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <motion.span 
                          className="bg-apple-red/10 text-apple-red px-3 py-2 rounded-full font-sf-pro-text font-medium text-sm"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link 
              href="/products" 
              className="inline-flex items-center px-12 py-4 bg-apple-blue hover:bg-apple-blue-dark text-white font-sf-pro-text font-medium text-lg rounded-full transition-all duration-300 ease-apple shadow-apple hover:shadow-apple-lg"
            >
              Alle Produkte ansehen
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts