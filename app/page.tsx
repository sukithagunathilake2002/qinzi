'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSlider } from '@/components/hero-slider'
import { ProductCard } from '@/components/product-card'
import { PRODUCTS } from '@/lib/products'
import { getStoredProducts } from '@/lib/product-storage'
import { hasDiscount } from '@/lib/pricing'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const categories = [
    { name: 'Clothing', href: '/clothing', image: '/cloth1.jpeg' },
    { name: 'Slippers', href: '/slippers', image: '/sliper1.jpeg' },
    { name: 'Jewellery', href: '/jewellery', image: '/juw1.jpeg' },
    { name: 'Customisation', href: '/customisation', image: '/custormization.jpeg' },
  ]
  const [products, setProducts] = useState(PRODUCTS)
  const saleItems = products.filter((product) => hasDiscount(product)).slice(0, 4)
  const bestSellers = products.filter((product) => product.bestSelling).slice(0, 4)

  useEffect(() => {
    setProducts(getStoredProducts())
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden">
        <HeroSlider />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">

        {/* Categories */}
        <div className="mb-16 sm:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-8 text-foreground mx-auto">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-lg aspect-square bg-secondary flex items-center justify-center hover:shadow-lg transition"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-5 bottom-5 bg-white/90 py-3 transition duration-300 group-hover:opacity-0">
                  <span className="block text-center text-sm sm:text-base font-semibold uppercase tracking-wide text-foreground">
                    {category.name}
                  </span>
                </div>
                <div className="absolute inset-5 flex items-center justify-center border border-border bg-white/85 opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="text-sm sm:text-base font-semibold uppercase tracking-wide text-foreground">
                    {category.name}
                  </span>
                </div>
                <span className="sr-only">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sales Section */}
        <div className="mb-16 sm:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 mx-auto">
            SALES
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
            Discover limited-time offers on our most-loved styles. Shop now before they’re gone.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="mb-16 sm:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 mx-auto">
            Best Sellers
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
            Our most popular picks, loved by customers for their style, comfort, and quality.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 py-12 sm:py-16 bg-secondary rounded-2xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground">
            Custom Creations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Can&apos;t find what you&apos;re looking for? Let us create something special just for you.
            Our customization service brings your vision to life.
          </p>
          <Link
            href="/customisation"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition transform hover:scale-105"
          >
            Explore Custom Options
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
