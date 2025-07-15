import { Metadata } from 'next';
import ProductDetail from '@/components/product/ProductDetail';

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // In einer echten App würden wir hier das Produkt laden
  return {
    title: 'Produktdetails | Innovate3D Labs',
    description: 'Detaillierte Produktinformationen und Spezifikationen',
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail productId={params.id} />
    </div>
  );
}