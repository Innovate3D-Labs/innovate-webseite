export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  rating: number
  reviews: number
  features: string[]
  specifications: Record<string, string>
  inStock: boolean
  badge?: string
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'customer' | 'admin'
}

export interface CartItem {
  productId: string
  quantity: number
  selectedOptions?: Record<string, string>
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  shippingAddress: Address
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
  name: string
}