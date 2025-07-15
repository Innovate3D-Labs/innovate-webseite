import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/context/CartContext'
import { AuthProvider } from '@/lib/context/AuthContext'
import { WebSocketProvider } from '@/lib/context/WebSocketContext'
import NotificationSystem from '@/components/ui/NotificationSystem'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Innovate3D Labs',
  description: 'Innovative 3D-Drucklösungen und Cabletree-Systeme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0066ff" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <WebSocketProvider>
            <CartProvider>
              <NotificationSystem position="top-right" />
              {children}
            </CartProvider>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}