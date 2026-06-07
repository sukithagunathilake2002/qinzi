'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import { formatPrice, getDiscountedPrice, hasDiscount } from '@/lib/pricing'
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Start shopping to add items to your cart</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-secondary rounded-lg">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-foreground">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>

                    <div className="flex gap-4 mt-2">
                      {item.selectedColor && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Color:</span>
                          <span className="text-sm text-foreground">{item.selectedColor}</span>
                        </div>
                      )}
                      {item.selectedSize && item.selectedSize !== 'One Size' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Size:</span>
                          <span className="text-sm text-foreground">{item.selectedSize}</span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-background rounded transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-background rounded transition"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-2 hover:bg-background rounded transition text-destructive"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-serif font-bold text-primary">
                      {formatPrice(getDiscountedPrice(item.product) * item.quantity)}
                      </p>
                      {hasDiscount(item.product) && (
                        <p className="text-xs text-red-600 line-through">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(getDiscountedPrice(item.product))} each
                      </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-secondary rounded-lg p-6 h-fit">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">Rs {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">Rs 500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">Rs {Math.round(total * 0.18).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-lg font-serif font-bold">
              <span>Total</span>
              <span className="text-primary">
                Rs {(total + 500 + Math.round(total * 0.18)).toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full block text-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition mb-3"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={clearCart}
              className="w-full px-6 py-2 border border-border text-foreground rounded-lg hover:bg-background transition"
            >
              Clear Cart
            </button>

            <Link
              href="/products"
              className="block text-center mt-4 text-primary hover:text-primary/80 font-semibold transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
