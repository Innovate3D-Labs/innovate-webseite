import { Metadata } from 'next';
import CategoryPage from '@/components/product/CategoryPage';

export const metadata: Metadata = {
  title: 'Filamente | Innovate3D Labs',
  description: 'Hochwertige 3D-Druck-Filamente in verschiedenen Materialien und Farben für professionelle Anwendungen.',
};

export default function FilamentePage() {
  return (
    <CategoryPage 
      category="filamente"
      title="Filamente"
      description="Hochwertige 3D-Druck-Filamente für alle Anwendungen"
    />
  );
}