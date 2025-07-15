import { Metadata } from 'next'
import CategoryPage from '@/components/product/CategoryPage'

export const metadata: Metadata = {
  title: '3D-Drucker | Innovate3D Labs',
  description: 'Entdecken Sie unsere hochwertigen 3D-Drucker für professionelle Anwendungen.',
}

export default function ThreeDPrintersPage() {
  return (
    <div className="min-h-screen">
      <CategoryPage 
        category="3d-printers"
        title="3D-Drucker"
        description="Präzise, zuverlässig und innovativ – unsere 3D-Drucker setzen neue Maßstäbe in der additiven Fertigung."
      />
    </div>
  )
}