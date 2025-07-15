'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container-apple text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-12"
        >
          {/* Main Headline */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-display text-6xl-apple text-gray-900 max-w-4xl mx-auto"
            >
              Shaping the Future
              <br />
              <span className="gradient-text">Layer by Layer</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-body text-xl-apple text-gray-600 max-w-2xl mx-auto"
            >
              Entdecken Sie Premium 3D-Drucker, innovatives Zubehör und maßgeschneiderte Cabletrees für Oldtimer. 
              Präzision trifft auf Design.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/products" className="btn-primary group focus-ring">
              Produkte entdecken
              <ChevronRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <button className="btn-secondary group flex items-center focus-ring">
              <PlayIcon className="w-4 h-4 mr-2" />
              Demo ansehen
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-20 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-display text-4xl-apple text-gray-900 mb-2">500+</div>
              <div className="text-body text-lg-apple text-gray-600">Zufriedene Kunden</div>
            </div>
            <div className="text-center">
              <div className="text-display text-4xl-apple text-gray-900 mb-2">50+</div>
              <div className="text-body text-lg-apple text-gray-600">Premium Produkte</div>
            </div>
            <div className="text-center">
              <div className="text-display text-4xl-apple text-gray-900 mb-2">99.9%</div>
              <div className="text-body text-lg-apple text-gray-600">Verfügbarkeit</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-5 h-8 border border-gray-300 rounded-full flex justify-center">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 h-2 bg-gray-400 rounded-full mt-1.5"
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero