'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import { formatPrice, getDiscountedPrice } from '@/lib/pricing'
import { useState } from 'react'
import { Upload, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    accountName: '',
    bankName: '',
  })
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const taxAmount = Math.round(total * 0.18)
  const shippingFee = 500
  const finalTotal = total + taxAmount + shippingFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPaymentSlip(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate order submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock order creation
      const order = {
        id: `ORD-${Date.now()}`,
        customerName: formData.fullName,
        customerEmail: formData.email,
        items: items,
        total: finalTotal,
        status: 'Pending' as const,
        bankDetails: {
          accountName: formData.accountName,
          bankName: formData.bankName,
        },
        paymentSlip: paymentSlip?.name,
        createdAt: new Date(),
      }

      // Store order (in a real app, this would go to a database)
      const orders = JSON.parse(localStorage.getItem('niwera-orders') || '[]')
      orders.push(order)
      localStorage.setItem('niwera-orders', JSON.stringify(orders))

      setOrderPlaced(true)
      clearCart()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add items to your cart before checking out</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <CheckCircle size={64} className="mx-auto mb-6 text-primary" />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been submitted and is pending approval.
            You&apos;ll receive a confirmation email shortly.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-secondary rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-secondary rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <textarea
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-secondary rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">Bank Transfer Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="accountName"
                  placeholder="Account Name"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  name="bankName"
                  placeholder="Bank Name"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Payment Slip */}
            <div className="bg-secondary rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">Payment Proof</h2>
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition">
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {paymentSlip ? paymentSlip.name : 'Click to upload payment slip'}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-secondary rounded-lg p-6 h-fit">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.product.name} x {item.quantity}</span>
                  <span className="text-foreground">{formatPrice(getDiscountedPrice(item.product) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">Rs {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">Rs {shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (18%)</span>
                <span className="text-foreground">Rs {taxAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-serif font-bold">
              <span>Total</span>
              <span className="text-primary">Rs {finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
