'use client'

import { Product } from '@/lib/types'
import { formatPrice, getDiscountedPrice, hasDiscount } from '@/lib/pricing'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isDiscounted = hasDiscount(product)
  const salePrice = getDiscountedPrice(product)

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group animate-fade-in cursor-pointer">
        <div className="relative overflow-hidden rounded-none bg-secondary mb-4 aspect-[4/5] shadow-sm">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isDiscounted && (
            <div className="absolute left-3 top-3 z-10 space-y-1">
              <span className="block bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                -{product.discountPercentage}%
              </span>
              {product.available && (
                <span className="block bg-teal-600 px-2 py-1 text-xs font-semibold text-white">
                  In stock
                </span>
              )}
            </div>
          )}
          {!product.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 px-6">
            <span className="block w-full max-w-44 bg-black text-white px-6 py-3 rounded-none text-center text-sm font-semibold uppercase tracking-wide group-hover:bg-primary transition">
              Quick View
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[0.5rem] tracking-[0.35em] uppercase text-muted-foreground text-center">
            {product.category}
          </p>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-serif text-xs sm:text-sm text-foreground font-semibold flex-1">
              {product.name}
            </h3>
            <div className="whitespace-nowrap text-right">
              {isDiscounted && (
                <p className="text-xs text-red-600 line-through">
                  {formatPrice(product.price)}
                </p>
              )}
              <p className="text-sm sm:text-base font-serif font-bold text-primary">
                {formatPrice(salePrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
