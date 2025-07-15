import { Metadata } from 'next';
import ProductSearch from '@/components/product/ProductSearch';

export const metadata: Metadata = {
  title: 'Produktsuche | Innovate3D Labs',
  description: 'Durchsuchen Sie unser komplettes Sortiment an 3D-Druckern, Filamenten und Zubehör.',
};

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produktsuche</h1>
          <p className="text-gray-600">
            Finden Sie die perfekten 3D-Druck-Produkte für Ihre Projekte
          </p>
        </div>
        
        <ProductSearch initialCategory={category} />
      </div>
    </div>
  );
}