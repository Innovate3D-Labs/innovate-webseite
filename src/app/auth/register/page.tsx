'use client'

import RegistrationForm from '@/components/auth/RegistrationForm'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import SectionSeparator from '@/components/ui/SectionSeparator'

export default function RegisterPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="md" variant="none" />
        </div>
        
        <div className="max-w-md mx-auto px-6">
          <RegistrationForm />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="xl" variant="gradient" />
        </div>
      </main>
      <Footer />
    </>
  )
}