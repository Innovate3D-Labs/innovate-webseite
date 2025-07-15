'use client'

import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'

interface ProductSpecsProps {
  specifications: Record<string, string>
}

const ProductSpecs = ({ specifications }: ProductSpecsProps) => {
  const specEntries = Object.entries(specifications)

  return (
    <div>
      <h3 className="text-2xl font-sf-pro-display font-semibold text-apple-gray-1 mb-8">
        Technische Spezifikationen
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specEntries.map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="p-6" variant="glass" hover>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-sf-pro-text font-medium text-apple-gray-1 mb-2">
                    {key}
                  </h4>
                  <p className="text-apple-gray-2 font-sf-pro-text">
                    {value}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Download Section */}
      <motion.div
        className="mt-12 p-8 bg-apple-gray-6 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h4 className="text-xl font-sf-pro-display font-semibold text-apple-gray-1 mb-4">
          Downloads
        </h4>
        <div className="flex flex-wrap gap-4">
          <motion.button
            className="px-6 py-3 bg-apple-blue hover:bg-apple-blue-dark text-white rounded-xl font-sf-pro-text font-medium transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Datenblatt herunterladen
          </motion.button>
          <motion.button
            className="px-6 py-3 border border-apple-gray-4 hover:bg-apple-gray-5 text-apple-gray-1 rounded-xl font-sf-pro-text font-medium transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bedienungsanleitung
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductSpecs