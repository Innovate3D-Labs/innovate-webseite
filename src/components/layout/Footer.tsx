'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'
import { 
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    products: [
      { name: '3D Drucker', href: '/products/3d-printers' },
      { name: 'Filamente', href: '/products/filaments' },
      { name: 'Zubehör', href: '/products/accessories' },
      { name: 'Cabletrees', href: '/products/cabletrees' },
      { name: 'Ersatzteile', href: '/products/spare-parts' }
    ],
    support: [
      { name: 'Hilfe Center', href: '/support' },
      { name: 'Installation', href: '/support/installation' },
      { name: 'Wartung', href: '/support/maintenance' },
      { name: 'Downloads', href: '/support/downloads' },
      { name: 'Kontakt', href: '/contact' }
    ],
    company: [
      { name: 'Über uns', href: '/about' },
      { name: 'Karriere', href: '/careers' },
      { name: 'Presse', href: '/press' },
      { name: 'Partner', href: '/partners' },
      { name: 'Blog', href: '/blog' }
    ],
    legal: [
      { name: 'Datenschutz', href: '/privacy' },
      { name: 'AGB', href: '/terms' },
      { name: 'Impressum', href: '/imprint' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Widerruf', href: '/cancellation' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ]

  return (
    <footer className="bg-apple-gray-6 text-apple-gray-1 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-apple-gray-6 to-black/5 pointer-events-none" />
      
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-apple-blue to-apple-purple rounded-2xl flex items-center justify-center shadow-apple">
                  <span className="text-white font-sf-pro-display font-semibold text-lg">I3D</span>
                </div>
                <span className="font-sf-pro-display font-semibold text-3xl text-apple-gray-1">Innovate3D-Labs</span>
              </div>
              
              <p className="text-apple-gray-2 mb-8 leading-relaxed font-sf-pro-text text-lg max-w-md">
                Wir gestalten die Zukunft des 3D-Drucks Schicht für Schicht. 
                Mit Premium-Produkten und innovativen Lösungen bringen wir 
                Ihre Ideen zum Leben.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center space-x-4 group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="w-10 h-10 bg-apple-gray-5 rounded-xl flex items-center justify-center group-hover:bg-apple-blue transition-all duration-300">
                    <EnvelopeIcon className="w-5 h-5 text-apple-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-apple-gray-2 font-sf-pro-text">info@innovate3d-labs.de</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-4 group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="w-10 h-10 bg-apple-gray-5 rounded-xl flex items-center justify-center group-hover:bg-apple-blue transition-all duration-300">
                    <PhoneIcon className="w-5 h-5 text-apple-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-apple-gray-2 font-sf-pro-text">+49 (0) 123 456 789</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-4 group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="w-10 h-10 bg-apple-gray-5 rounded-xl flex items-center justify-center group-hover:bg-apple-blue transition-all duration-300">
                    <MapPinIcon className="w-5 h-5 text-apple-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-apple-gray-2 font-sf-pro-text">Musterstraße 123, 12345 Berlin</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <h3 className="font-sf-pro-display font-semibold text-xl mb-8 text-apple-gray-1">Produkte</h3>
            <ul className="space-y-4">
              {footerLinks.products.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href} 
                    className="text-apple-gray-2 hover:text-apple-blue font-sf-pro-text transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <h3 className="font-sf-pro-display font-semibold text-xl mb-8 text-apple-gray-1">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href} 
                    className="text-apple-gray-2 hover:text-apple-blue font-sf-pro-text transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <h3 className="font-sf-pro-display font-semibold text-xl mb-8 text-apple-gray-1">Unternehmen</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={link.href} 
                    className="text-apple-gray-2 hover:text-apple-blue font-sf-pro-text transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="mt-20 pt-12 border-t border-apple-gray-5/30"
        >
          <div className="max-w-lg">
            <h3 className="font-sf-pro-display font-semibold text-2xl mb-4 text-apple-gray-1">Newsletter abonnieren</h3>
            <p className="text-apple-gray-2 mb-8 font-sf-pro-text text-lg leading-relaxed">
              Bleiben Sie auf dem Laufenden über neue Produkte und Innovationen.
            </p>
            <div className="flex rounded-2xl overflow-hidden shadow-apple bg-apple-gray-5/20 backdrop-blur-sm border border-apple-gray-5/30">
              <input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 px-6 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-apple-gray-1 placeholder-apple-gray-3 font-sf-pro-text"
              />
              <motion.button 
                className="px-8 py-4 bg-apple-blue hover:bg-apple-blue-dark font-sf-pro-text font-medium text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Abonnieren
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-apple-gray-5/20 bg-apple-gray-6/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-apple-gray-3 font-sf-pro-text text-sm">
              © 2024 Innovate3D-Labs. Alle Rechte vorbehalten.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-8">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-apple-gray-3 hover:text-apple-gray-1 font-sf-pro-text text-sm transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-apple-gray-5/30 hover:bg-apple-blue rounded-xl flex items-center justify-center text-apple-gray-2 hover:text-white transition-all duration-300 backdrop-blur-sm"
                    aria-label={social.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-apple-gray-5/80 hover:bg-apple-blue backdrop-blur-xl text-apple-gray-1 hover:text-white rounded-2xl shadow-apple transition-all duration-300 border border-apple-gray-5/30"
        aria-label="Nach oben scrollen"
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ArrowUpIcon className="w-6 h-6 mx-auto" />
      </motion.button>
    </footer>
  )
}

export default Footer