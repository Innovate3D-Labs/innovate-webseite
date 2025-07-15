'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import CartButton from '@/components/cart/CartButton'
import CartSidebar from '@/components/cart/CartSidebar'
import { useAuth } from '@/lib/context/AuthContext'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isLoading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Produkte', href: '/products' },
    { name: 'MakerWorld', href: '/makerworld' },
    { name: 'Meine Drucker', href: '/printers' },
    { name: 'Über uns', href: '/about' },
    { name: 'Kontakt', href: '/contact' },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-apple-glass backdrop-blur-xl border-b border-white/20 shadow-apple-sm' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-sf-pro-display font-bold text-apple-gray-900">
                  Innovate3D Labs
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-apple-gray-700 hover:text-apple-blue font-sf-pro-text font-medium transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-apple-blue transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
              
              {/* Auth Section */}
              {!isLoading && (
                <div className="flex items-center space-x-4">
                  {user ? (
                    <>
                      {/* User Menu */}
                      <div className="relative group">
                        <button className="flex items-center space-x-2 text-apple-gray-700 hover:text-apple-blue transition-colors duration-200">
                          <UserIcon className="w-5 h-5" />
                          <span className="font-sf-pro-text font-medium">
                            {user.firstName}
                          </span>
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-apple-lg border border-apple-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="py-2">
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-apple-gray-700 hover:bg-apple-gray-50 transition-colors duration-200"
                            >
                              Mein Profil
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-apple-gray-700 hover:bg-apple-gray-50 transition-colors duration-200"
                            >
                              Meine Bestellungen
                            </Link>
                            <hr className="my-1 border-apple-border" />
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <ArrowRightOnRectangleIcon className="w-4 h-4" />
                              <span>Abmelden</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="text-apple-gray-700 hover:text-apple-blue font-sf-pro-text font-medium transition-colors duration-200"
                      >
                        Anmelden
                      </Link>
                      <Link
                        href="/auth/register"
                        className="bg-apple-blue text-white px-4 py-2 rounded-lg font-sf-pro-text font-medium hover:bg-apple-blue-dark transition-colors duration-200"
                      >
                        Registrieren
                      </Link>
                    </>
                  )}
                </div>
              )}
              
              {/* Cart Button */}
              <CartButton onClick={() => setIsCartOpen(true)} />
            </motion.div>

            {/* Mobile menu button */}
            <motion.div 
              className="md:hidden flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <CartButton onClick={() => setIsCartOpen(true)} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-apple-gray-700 hover:text-apple-blue transition-colors duration-200"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden bg-apple-glass backdrop-blur-xl border-t border-white/20"
            >
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block text-apple-gray-700 hover:text-apple-blue font-sf-pro-text font-medium transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Auth Section */}
                {!isLoading && (
                  <div className="border-t border-white/20 pt-4 space-y-4">
                    {user ? (
                      <>
                        <div className="text-apple-gray-600 text-sm">
                          Angemeldet als {user.firstName} {user.lastName}
                        </div>
                        <Link
                          href="/profile"
                          className="block text-apple-gray-700 hover:text-apple-blue font-sf-pro-text font-medium transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          Mein Profil
                        </Link>
                        <Link
                          href="/orders"
                          className="block text-apple-gray-700 hover:text-apple-blue font-sf-pro-text font-medium transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          Meine Bestellungen
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left text-red-600 hover:text-red-700 font-sf-pro-text font-medium transition-colors duration-200"
                        >
                          Abmelden
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block text-apple-gray-700 hover:text-apple-blue font-sf-pro-text font-medium transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          Anmelden
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block bg-apple-blue text-white px-4 py-2 rounded-lg font-sf-pro-text font-medium hover:bg-apple-blue-dark transition-colors duration-200 text-center"
                          onClick={() => setIsOpen(false)}
                        >
                          Registrieren
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Navigation