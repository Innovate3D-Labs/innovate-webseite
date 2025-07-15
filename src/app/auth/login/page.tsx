import { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Anmelden | Innovate3D Labs',
  description: 'Melden Sie sich in Ihrem Innovate3D Labs Konto an.',
}

export default function LoginPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  )
}