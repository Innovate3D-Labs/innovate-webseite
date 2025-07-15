import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';
import SectionSeparator from '@/components/ui/SectionSeparator';

export const metadata: Metadata = {
  title: 'Mein Profil | Innovate3D Labs',
  description: 'Verwalten Sie Ihr Profil, Bestellungen und Einstellungen bei Innovate3D Labs.',
};

export default function ProfilePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="md" variant="none" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <UserProfile />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionSeparator spacing="xl" variant="dots" />
        </div>
      </main>
      <Footer />
    </>
  );
}