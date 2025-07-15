'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Main Image */}
        <motion.div
          className="relative aspect-square bg-apple-gray-6 rounded-3xl overflow-hidden cursor-zoom-in"
          onClick={() => setIsFullscreen(true)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={images[activeImage]}
            alt={`${productName} - Bild ${activeImage + 1}`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-apple"
              >
                <ChevronLeftIcon className="w-6 h-6 text-apple-gray-1" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-apple"
              >
                <ChevronRightIcon className="w-6 h-6 text-apple-gray-1" />
              </button>
            </>
          )}
        </motion.div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  activeImage === index
                    ? 'border-apple-blue shadow-apple'
                    : 'border-transparent hover:border-apple-gray-4'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square bg-white rounded-3xl overflow-hidden">
                <Image
                  src={images[activeImage]}
                  alt={`${productName} - Vollbild`}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-apple-gray-6 transition-colors duration-200 shadow-apple"
              >
                <XMarkIcon className="w-6 h-6 text-apple-gray-1" />
              </button>
              
              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-apple"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-apple-gray-1" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-apple"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-apple-gray-1" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductGallery