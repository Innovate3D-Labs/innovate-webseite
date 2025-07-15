'use client'

import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'

interface CartButtonProps {
  onClick: () => void
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { state } = useCart()

  return (
    <motion.button
      onClick={onClick}
      className="relative p-3 text-apple-gray-700 hover:text-apple-blue transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ShoppingBagIcon className="w-6 h-6" />
      {state.itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-apple-red text-white text-xs font-sf-pro-text font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </motion.span>
      )}
    </motion.button>
  )
}