'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/context/CartContext'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { CreditCardIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Stripe Payment Form Component
function StripePaymentForm({ clientSecret, onSuccess, onError, isLoading, setIsLoading }: {
  clientSecret: string
  onSuccess: () => void
  onError: (error: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required'
      })

      if (error) {
        onError(error.message || 'Ein Fehler bei der Zahlung ist aufgetreten.')
      } else {
        onSuccess()
      }
    } catch (err) {
      onError('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-apple-border rounded-xl">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>
      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        className="w-full"
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Zahlung wird verarbeitet...' : 'Jetzt bezahlen'}
      </Button>
    </form>
  )
}

const CheckoutPage = () => {
  const { state, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
    paymentMethod: 'card'
  })

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const createPaymentIntent = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: Math.round(state.total * 1.19 * 100), // In Cents, mit MwSt
          items: state.items,
          shipping: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: 'DE'
            }
          }
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setClientSecret(data.clientSecret)
      } else {
        setError(data.error || 'Fehler beim Erstellen der Zahlung.')
      }
    } catch (err) {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      // Bestellung bestätigen
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentIntentId: clientSecret.split('_secret')[0],
          shipping: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: 'DE'
            }
          }
        })
      })

      if (response.ok) {
        clearCart()
        router.push('/checkout/success')
      } else {
        setError('Bestellung konnte nicht bestätigt werden.')
      }
    } catch (err) {
      setError('Fehler bei der Bestellbestätigung.')
    }
  }

  const steps = [
    { id: 1, name: 'Lieferadresse', icon: TruckIcon },
    { id: 2, name: 'Zahlung', icon: CreditCardIcon },
    { id: 3, name: 'Bestätigung', icon: ShieldCheckIcon }
  ]

  // Redirect if cart is empty
  if (state.items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-sf-pro-display font-bold text-apple-gray-900 mb-8">
          Kasse
        </h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon
              const isActive = step >= stepItem.id
              const isCurrent = step === stepItem.id
              
              return (
                <div key={stepItem.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    isActive ? 'text-apple-blue' : 'text-apple-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isActive 
                        ? 'border-apple-blue bg-apple-blue text-white' 
                        : 'border-apple-gray-300 bg-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-sf-pro-text font-medium ${
                      isCurrent ? 'font-semibold' : ''
                    }`}>
                      {stepItem.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step > stepItem.id ? 'bg-apple-blue' : 'bg-apple-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-sf-pro-text font-semibold text-apple-gray-900 mb-6">
                  Lieferadresse
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                      placeholder="ihre@email.de"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
                        Vorname
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
                        Nachname
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                      placeholder="Straße und Hausnummer"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
                        PLZ
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
                        Stadt
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button 
                      variant="primary" 
                      onClick={() => setStep(2)}
                      disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.postalCode}
                    >
                      Weiter zur Zahlung
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-sf-pro-text font-semibold text-apple-gray-900 mb-6">
                  Zahlungsmethode
                </h2>
                
                {!clientSecret ? (
                  <div className="text-center py-8">
                    <Button 
                      variant="primary" 
                      onClick={createPaymentIntent}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Zahlung wird vorbereitet...' : 'Zahlung vorbereiten'}
                    </Button>
                  </div>
                ) : (
                  <Elements 
                    stripe={stripePromise} 
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#007AFF',
                          colorBackground: '#ffffff',
                          colorText: '#1d1d1f',
                          colorDanger: '#df1b41',
                          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                          spacingUnit: '4px',
                          borderRadius: '12px'
                        }
                      }
                    }}
                  >
                    <StripePaymentForm 
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={setError}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </Elements>
                )}
                
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Zurück
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-32">
              <h2 className="text-xl font-sf-pro-text font-semibold text-apple-gray-900 mb-6">
                Ihre Bestellung
              </h2>
              
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-sf-pro-text font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-apple-gray-600">Menge: {item.quantity}</p>
                    </div>
                    <p className="font-sf-pro-text font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-apple-gray-600">Zwischensumme</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-gray-600">Versand</span>
                  <span className="text-apple-green">Kostenlos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-gray-600">MwSt.</span>
                  <span>{formatPrice(state.total * 0.19)}</span>
                </div>
                <hr className="border-apple-border" />
                <div className="flex justify-between text-lg font-sf-pro-text font-bold">
                  <span>Gesamt</span>
                  <span>{formatPrice(state.total * 1.19)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CheckoutPage