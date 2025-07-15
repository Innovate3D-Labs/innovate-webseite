'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { notify } from '@/components/ui/NotificationSystem'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  newsletter: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  acceptTerms?: string
  general?: string
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    // Validation
    const newErrors: FormErrors = {}
    if (!formData.firstName) newErrors.firstName = 'Vorname ist erforderlich'
    if (!formData.lastName) newErrors.lastName = 'Nachname ist erforderlich'
    if (!formData.email) newErrors.email = 'E-Mail ist erforderlich'
    if (!formData.password) newErrors.password = 'Passwort ist erforderlich'
    if (formData.password.length < 6) newErrors.password = 'Passwort muss mindestens 6 Zeichen lang sein'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein'
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Sie müssen die AGB akzeptieren'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        notify.success('Registrierung erfolgreich!', 'Ihr Konto wurde erstellt. Sie werden zur Anmeldung weitergeleitet.')
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        const errorMessage = data.error || 'Registrierung fehlgeschlagen'
        setErrors({ general: errorMessage })
        notify.error('Registrierung fehlgeschlagen', errorMessage)
      }
    } catch (error) {
      const errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
      setErrors({ general: errorMessage })
      notify.error('Fehler', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
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
            Konto erstellen
          </h1>
          <p className="text-apple-gray-600">
            Registrieren Sie sich für Ihr Innovate3D Konto
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
                Vorname
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                placeholder="Max"
                required
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
                Nachname
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                placeholder="Mustermann"
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
              placeholder="ihre@email.de"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
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
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                placeholder="Mindestens 6 Zeichen"
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-sf-pro-text font-medium text-apple-gray-700 mb-2">
              Passwort bestätigen
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all"
                placeholder="Passwort wiederholen"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-apple-gray-400 hover:text-apple-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 rounded border-apple-border text-apple-blue focus:ring-apple-blue"
              />
              <span className="ml-2 text-sm text-apple-gray-600">
                Ich akzeptiere die{' '}
                <Link href="/terms" className="text-apple-blue hover:text-apple-blue-dark">
                  Allgemeinen Geschäftsbedingungen
                </Link>{' '}
                und die{' '}
                <Link href="/privacy" className="text-apple-blue hover:text-apple-blue-dark">
                  Datenschutzerklärung
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">{errors.acceptTerms}</p>
            )}

            <label className="flex items-center">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="rounded border-apple-border text-apple-blue focus:ring-apple-blue"
              />
              <span className="ml-2 text-sm text-apple-gray-600">
                Ich möchte den Newsletter erhalten (optional)
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Konto wird erstellt...' : 'Konto erstellen'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-apple-gray-600">
            Bereits ein Konto?{' '}
            <Link href="/auth/login" className="text-apple-blue hover:text-apple-blue-dark font-medium">
              Jetzt anmelden
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}