import { Metadata } from 'next';
import CategoryPage from '@/components/product/CategoryPage';

export const metadata: Metadata = {
  title: 'Zubehör | Innovate3D Labs',
  description: 'Professionelles 3D-Druck-Zubehör und Ersatzteile für optimale Druckergebnisse.',
};

export default function ZubehoerPage() {
  return (
    <CategoryPage 
      category="zubehoer"
      title="Zubehör"
      description="Professionelles Zubehör für Ihren 3D-Drucker"
    />
  );
}