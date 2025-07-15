import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import LoginForm from '@/components/auth/LoginForm'
import SectionSeparator from '@/components/ui/SectionSeparator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anmelden | Innovate3D Labs',
  description: 'Melden Sie sich in Ihrem Innovate3D Labs Konto an.',
}

export default function LoginPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="md" variant="none" />
        </div>
        
        <LoginForm />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="xl" variant="gradient" />
        </div>
      </main>
      <Footer />
    </>
  )
}