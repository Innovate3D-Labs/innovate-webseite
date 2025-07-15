'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { CubeIcon, WrenchScrewdriverIcon, CpuChipIcon } from '@heroicons/react/24/solid'

const ProductCategories = () => {
  const categories = [
    {
      id: '3d-printers',
      title: '3D Drucker',
      description: 'Hochpräzise 3D-Drucker für professionelle Anwendungen und Hobbyisten.',
      icon: CubeIcon,
      image: '/images/categories/3d-printers.jpg',
      href: '/products/3d-printers',
      gradient: 'from-apple-blue to-apple-purple'
    },
    {
      id: 'accessories',
      title: '3D Zubehör',
      description: 'Hochwertiges Zubehör für optimale 3D-Druckergebnisse.',
      icon: WrenchScrewdriverIcon,
      image: '/images/categories/accessories.jpg',
      href: '/products/accessories',
      gradient: 'from-apple-green to-apple-teal'
    },
    {
      id: 'cabletrees',
      title: 'Cabletrees',
      description: 'Maßgeschneiderte Kabelbaum-Lösungen für klassische Automobile.',
      icon: CpuChipIcon,
      image: '/images/categories/cabletrees.jpg',
      href: '/products/cabletrees',
      gradient: 'from-apple-orange to-apple-red'
    }
  ]

  return (
    <section className="py-32 bg-apple-gray-50">
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
            Unsere Produktkategorien
          </motion.h2>
          <motion.p 
            className="text-xl lg:text-2xl text-apple-gray-600 max-w-4xl mx-auto font-sf-pro-text leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            Entdecken Sie unsere drei Hauptbereiche: Von präzisen 3D-Druckern über hochwertiges Zubehör 
            bis hin zu spezialisierten Cabletree-Lösungen.
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
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
                <Link href={category.href}>
                  <motion.div 
                    className="bg-white rounded-3xl overflow-hidden shadow-apple hover:shadow-apple-lg transition-all duration-500 ease-apple cursor-pointer h-full"
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative h-80 overflow-hidden">
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 1, rotate: 0 }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <IconComponent className="w-24 h-24 text-white drop-shadow-lg" />
                        </motion.div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-black/10 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <motion.div 
                          className="bg-white/20 backdrop-blur-md rounded-full p-4"
                          initial={{ scale: 0, rotate: -180 }}
                          whileHover={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <ArrowRightIcon className="w-6 h-6 text-white" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-10">
                      <motion.h3 
                        className="text-2xl lg:text-3xl font-sf-pro-display font-bold text-apple-gray-900 mb-4 tracking-tight group-hover:text-apple-blue transition-colors duration-300 ease-apple"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {category.title}
                      </motion.h3>
                      <p className="text-apple-gray-600 font-sf-pro-text text-lg leading-relaxed mb-6">
                        {category.description}
                      </p>
                      <motion.div 
                        className="flex items-center text-apple-blue font-sf-pro-text font-medium text-lg group-hover:text-apple-blue-dark transition-colors duration-300 ease-apple"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        Mehr erfahren
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <ArrowRightIcon className="w-5 h-5 ml-3" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProductCategories