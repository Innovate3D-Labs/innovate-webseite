import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen - Innovate3D Labs',
  description: 'Erstellen Sie ein neues Passwort',
};

export default function ResetPasswordPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <ResetPasswordForm />
        </div>
      </main>
      <Footer />
    </>
  );
}