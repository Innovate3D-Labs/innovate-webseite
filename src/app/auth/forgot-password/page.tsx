import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Passwort vergessen - Innovate3D Labs',
  description: 'Setzen Sie Ihr Passwort zurück',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <ForgotPasswordForm />
        </div>
      </main>
      <Footer />
    </>
  );
}