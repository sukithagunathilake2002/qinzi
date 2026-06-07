export interface Product {
  id: string
  name: string
  category: 'Clothing' | 'Slippers' | 'Jewellery' | 'Customisation'
  price: number
  discountPercentage?: number
  bestSelling?: boolean
  image: string
  colors: string[]
  sizes: string[]
  sizeQuantities?: Record<string, number>
  description: string
  available: boolean
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: CartItem[]
  total: number
  status: 'Pending' | 'Accepted' | 'Rejected'
  paymentSlip?: string
  bankDetails?: {
    accountName: string
    bankName: string
  }
  createdAt: Date
}

export interface FilterOptions {
  colors: string[]
  sizes: string[]
  priceRange: [number, number]
  availability: boolean
}
