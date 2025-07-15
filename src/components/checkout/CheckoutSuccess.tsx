'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { CheckCircleIcon, EnvelopeIcon, TruckIcon } from '@heroicons/react/24/outline'

export default function CheckoutSuccess() {
  return (
    <div className="max-w-2xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-8 text-center">
          <div className="mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-sf-pro-display font-bold text-apple-gray-900 mb-2">
              Bestellung erfolgreich!
            </h1>
            <p className="text-apple-gray-600">
              Vielen Dank für Ihre Bestellung. Wir haben Ihre Zahlung erhalten und bearbeiten Ihre Bestellung.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3 text-apple-gray-600">
              <EnvelopeIcon className="w-5 h-5" />
              <span>Bestätigungsmail wurde versendet</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-apple-gray-600">
              <TruckIcon className="w-5 h-5" />
              <span>Versand in 1-3 Werktagen</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/profile">
              <Button variant="primary" size="lg" className="w-full">
                Bestellungen anzeigen
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full">
                Weiter einkaufen
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}