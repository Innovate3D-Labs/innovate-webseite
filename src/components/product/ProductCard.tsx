'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  category?: string
  imageUrl?: string
  className?: string
}

export default function ProductCard({
  id,
  name,
  price,
  category,
  imageUrl,
  className = ''
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageCount = 4 // Simulate multiple images with dots

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl overflow-hidden ${className}`}
    >
      <Link href={`/products/${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Image Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(imageCount)].map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentImageIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-gray-800 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Product Name */}
          <h3 className="text-center text-base font-medium text-gray-900 mb-2">
            {name}
          </h3>

          {/* Price */}
          <p className="text-center text-lg font-medium text-gray-900">
            {formatPrice(price)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
} 