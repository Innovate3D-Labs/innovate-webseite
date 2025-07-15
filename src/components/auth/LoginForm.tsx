'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/context/AuthContext'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Use Auth Context login function
        login(data.token, data.user)
        
        // Redirect to profile or home
        router.push('/profile')
      } else {
        setError(data.error || 'Anmeldung fehlgeschlagen')
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-sf-pro-display font-bold text-apple-gray-900 mb-2">
            Willkommen zurück
          </h1>
          <p className="text-apple-gray-600">
            Melden Sie sich in Ihrem Konto an
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
              Passwort
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                placeholder="Ihr Passwort"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-apple-gray-400 hover:text-apple-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-apple-border text-apple-blue focus:ring-apple-blue"
              />
              <span className="ml-2 text-sm text-apple-gray-600">Angemeldet bleiben</span>
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-apple-blue hover:text-apple-blue-dark">
              Passwort vergessen?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-apple-gray-600">
            Noch kein Konto?{' '}
            <Link href="/auth/register" className="text-apple-blue hover:text-apple-blue-dark font-medium">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

export default LoginForm