import { Metadata } from 'next';
import CategoryPage from '@/components/product/CategoryPage';

export const metadata: Metadata = {
  title: 'Software | Innovate3D Labs',
  description: 'Professionelle 3D-Software und Tools für Design, Slicing und Druckvorbereitung.',
};

export default function SoftwarePage() {
  return (
    <CategoryPage 
      category="software"
      title="Software"
      description="Professionelle Software-Lösungen für 3D-Druck"
    />
  );
}