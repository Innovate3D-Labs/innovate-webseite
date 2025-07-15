import { Metadata } from 'next';
import UserProfile from '@/components/auth/UserProfile';

export const metadata: Metadata = {
  title: 'Mein Profil | Innovate3D Labs',
  description: 'Verwalten Sie Ihr Profil, Bestellungen und Einstellungen bei Innovate3D Labs.',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}