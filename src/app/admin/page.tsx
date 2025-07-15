import { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Innovate3D Labs',
  description: 'Verwaltung von Produkten, Bestellungen und Benutzern.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}