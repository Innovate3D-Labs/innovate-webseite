import { Metadata } from 'next';
import ProductDetail from '@/components/product/ProductDetail';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  // In einer echten App würden wir hier das Produkt laden
  return {
    title: 'Produktdetails | Innovate3D Labs',
    description: 'Detaillierte Produktinformationen und Spezifikationen',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail productId={id} />
    </div>
  );
}