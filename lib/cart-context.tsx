'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem, Product } from './types'
import { getDiscountedPrice } from './pricing'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number, color?: string, size?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('niwera-cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load cart:', e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('niwera-cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (product: Product, quantity: number, color?: string, size?: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.id && item.selectedColor === color && item.selectedSize === size
      )

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === existingItem.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }

      return [
        ...prevItems,
        {
          id: `${product.id}-${Date.now()}-${Math.random()}`,
          productId: product.id,
          product,
          quantity,
          selectedColor: color,
          selectedSize: size,
        },
      ]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + getDiscountedPrice(item.product) * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
