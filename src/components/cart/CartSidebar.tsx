'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ShoppingBagIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, dispatch } = useCart()

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-apple-gray-200">
                      <Dialog.Title className="text-2xl font-sf-pro-display font-bold text-apple-gray-900">
                        Warenkorb
                      </Dialog.Title>
                      <button
                        type="button"
                        className="p-2 text-apple-gray-400 hover:text-apple-gray-600 transition-colors duration-200"
                        onClick={onClose}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      {state.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <ShoppingBagIcon className="w-16 h-16 text-apple-gray-300 mb-4" />
                          <p className="text-apple-gray-500 font-sf-pro-text text-lg mb-2">
                            Ihr Warenkorb ist leer
                          </p>
                          <p className="text-apple-gray-400 font-sf-pro-text">
                            Fügen Sie Produkte hinzu, um loszulegen
                          </p>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {state.items.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: 100 }}
                              className="flex items-center space-x-4 py-4 border-b border-apple-gray-100 last:border-b-0"
                            >
                              {/* Product Image */}
                              <div className="w-16 h-16 bg-apple-gray-100 rounded-xl flex items-center justify-center">
                                <span className="text-apple-gray-400 text-xs font-sf-pro-text">
                                  Bild
                                </span>
                              </div>

                              {/* Product Info */}
                              <div className="flex-1">
                                <h3 className="font-sf-pro-text font-medium text-apple-gray-900 text-sm">
                                  {item.name}
                                </h3>
                                <p className="text-apple-gray-500 text-xs font-sf-pro-text">
                                  {item.category}
                                </p>
                                <p className="text-apple-blue font-sf-pro-display font-bold text-lg">
                                  €{formatPrice(item.price)}
                                </p>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 rounded-full bg-apple-gray-100 hover:bg-apple-gray-200 transition-colors duration-200"
                                >
                                  <MinusIcon className="w-4 h-4 text-apple-gray-600" />
                                </button>
                                <span className="w-8 text-center font-sf-pro-text font-medium text-apple-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 rounded-full bg-apple-gray-100 hover:bg-apple-gray-200 transition-colors duration-200"
                                >
                                  <PlusIcon className="w-4 h-4 text-apple-gray-600" />
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-1 rounded-full bg-apple-red/10 hover:bg-apple-red/20 transition-colors duration-200 ml-2"
                                >
                                  <TrashIcon className="w-4 h-4 text-apple-red" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>

                    {/* Footer */}
                    {state.items.length > 0 && (
                      <div className="border-t border-apple-gray-200 px-6 py-6">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-lg font-sf-pro-text font-medium text-apple-gray-900">
                            Gesamt:
                          </span>
                          <span className="text-2xl font-sf-pro-display font-bold text-apple-gray-900">
                            €{formatPrice(state.total)}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <Link href="/checkout" onClick={onClose}>
                            <Button variant="primary" size="lg" className="w-full">
                              Zur Kasse ({state.itemCount})
                            </Button>
                          </Link>
                          <Button 
                            variant="secondary" 
                            size="lg" 
                            className="w-full"
                            onClick={onClose}
                          >
                            Weiter einkaufen
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}