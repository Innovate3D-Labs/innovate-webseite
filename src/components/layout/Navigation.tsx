'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CogIcon,
  ShoppingBagIcon,
  HeartIcon,
  CubeIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline'
import CartButton from '@/components/cart/CartButton'
import CartSidebar from '@/components/cart/CartSidebar'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useRealtimeNotifications } from '@/lib/context/WebSocketContext'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const notifications = useRealtimeNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Produkte', href: '/products', icon: ShoppingBagIcon },
    { name: 'MakerWorld', href: '/makerworld', icon: CubeIcon },
    { name: 'Meine Drucker', href: '/printers', icon: CommandLineIcon },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    setShowProfileMenu(false)
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
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
              className="hidden md:flex items-center space-x-6 flex-1 justify-center"
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
                    className="flex items-center space-x-2 text-apple-gray-700 hover:text-apple-blue font-sf-pro-text font-medium transition-all duration-200 relative group px-3 py-2 rounded-lg hover:bg-apple-gray-50"
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.name}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-apple-blue transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
              
            </motion.div>

            {/* Right Section */}
            <motion.div
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-apple-gray-700 hover:text-apple-blue hover:bg-apple-gray-50 rounded-lg transition-all duration-200"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
                
                <AnimatePresence>
                  {showSearch && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-80"
                    >
                      <form onSubmit={handleSearch} className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Suchen..."
                          className="w-full px-4 py-3 pl-10 bg-white rounded-xl shadow-apple-lg border border-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                          autoFocus
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-apple-gray-400" />
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              {user && (
                <button className="relative p-2 text-apple-gray-700 hover:text-apple-blue hover:bg-apple-gray-50 rounded-lg transition-all duration-200">
                  <BellIcon className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-apple-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-apple-gray-700 hover:text-apple-blue hover:bg-apple-gray-50 rounded-lg transition-all duration-200"
              >
                <HeartIcon className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <CartButton onClick={() => setIsCartOpen(true)} />

              {/* Auth Section */}
              {!isLoading && (
                <div className="flex items-center">
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center space-x-2 p-2 text-apple-gray-700 hover:text-apple-blue hover:bg-apple-gray-50 rounded-lg transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-apple-blue to-apple-purple rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.firstName?.charAt(0).toUpperCase()}
                        </div>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {showProfileMenu && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-apple-lg border border-apple-border overflow-hidden"
                          >
                            <div className="p-4 bg-apple-gray-50 border-b border-apple-border">
                              <p className="font-medium text-apple-gray-900">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-apple-gray-600">{user.email}</p>
                            </div>
                            <div className="py-2">
                              <Link
                                href="/profile"
                                className="flex items-center space-x-3 px-4 py-2.5 text-apple-gray-700 hover:bg-apple-gray-50 transition-colors"
                                onClick={() => setShowProfileMenu(false)}
                              >
                                <UserIcon className="w-5 h-5" />
                                <span>Mein Profil</span>
                              </Link>
                              <Link
                                href="/orders"
                                className="flex items-center space-x-3 px-4 py-2.5 text-apple-gray-700 hover:bg-apple-gray-50 transition-colors"
                                onClick={() => setShowProfileMenu(false)}
                              >
                                <ShoppingBagIcon className="w-5 h-5" />
                                <span>Bestellungen</span>
                              </Link>
                              <Link
                                href="/settings"
                                className="flex items-center space-x-3 px-4 py-2.5 text-apple-gray-700 hover:bg-apple-gray-50 transition-colors"
                                onClick={() => setShowProfileMenu(false)}
                              >
                                <CogIcon className="w-5 h-5" />
                                <span>Einstellungen</span>
                              </Link>
                              <hr className="my-2 border-apple-border" />
                              <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                              >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                <span>Abmelden</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link
                        href="/auth/login"
                        className="text-apple-gray-700 hover:text-apple-blue font-medium transition-colors"
                      >
                        Anmelden
                      </Link>
                      <Link
                        href="/auth/register"
                        className="bg-apple-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-apple-blue-dark transition-all shadow-sm hover:shadow-md"
                      >
                        Registrieren
                      </Link>
                    </div>
                  )}
                </div>
              )}
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