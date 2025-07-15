'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/lib/context/CartContext'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const CartPage = () => {
  const { state, dispatch } = useCart()

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'
  }

  if (state.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center py-20">
          <ShoppingBagIcon className="w-24 h-24 text-apple-gray-300 mx-auto mb-8" />
          <h1 className="text-4xl font-sf-pro-display font-bold text-apple-gray-900 mb-4">
            Ihr Warenkorb ist leer
          </h1>
          <p className="text-xl text-apple-gray-600 mb-8">
            Entdecken Sie unsere innovativen 3D-Drucker und Zubehör
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Produkte entdecken
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-sf-pro-display font-bold text-apple-gray-900 mb-8">
          Warenkorb ({state.itemCount} {state.itemCount === 1 ? 'Artikel' : 'Artikel'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 bg-apple-gray-100 rounded-xl flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.currentTarget.src = '/images/products/placeholder.jpg'
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-sf-pro-text font-semibold text-apple-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-apple-gray-600">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-apple-gray-400 hover:text-apple-red transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 rounded-full border border-apple-border hover:bg-apple-gray-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-sf-pro-text font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 rounded-full border border-apple-border hover:bg-apple-gray-50 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-sf-pro-text font-semibold text-apple-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-apple-gray-600">
                            {formatPrice(item.price)} pro Stück
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 sticky top-32">
                <h2 className="text-xl font-sf-pro-text font-semibold text-apple-gray-900 mb-6">
                  Bestellübersicht
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-apple-gray-600">Zwischensumme</span>
                    <span className="font-sf-pro-text font-medium">{formatPrice(state.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-apple-gray-600">Versand</span>
                    <span className="font-sf-pro-text font-medium text-apple-green">Kostenlos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-apple-gray-600">MwSt. (19%)</span>
                    <span className="font-sf-pro-text font-medium">{formatPrice(state.total * 0.19)}</span>
                  </div>
                  <hr className="border-apple-border" />
                  <div className="flex justify-between text-lg">
                    <span className="font-sf-pro-text font-semibold">Gesamt</span>
                    <span className="font-sf-pro-text font-bold text-apple-gray-900">
                      {formatPrice(state.total * 1.19)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <Button variant="primary" size="lg" className="w-full">
                      Zur Kasse
                    </Button>
                  </Link>
                  <Link href="/products" className="block">
                    <Button variant="outline" size="md" className="w-full">
                      Weiter einkaufen
                    </Button>
                  </Link>
                </div>

                {/* Trust Signals */}
                <div className="mt-6 pt-6 border-t border-apple-border">
                  <div className="space-y-3 text-sm text-apple-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-apple-green rounded-full"></div>
                      <span>Kostenloser Versand ab 50€</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-apple-green rounded-full"></div>
                      <span>30 Tage Rückgaberecht</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-apple-green rounded-full"></div>
                      <span>Sichere Zahlung</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CartPage