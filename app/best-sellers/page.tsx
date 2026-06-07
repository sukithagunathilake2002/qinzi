import { Suspense } from 'react'
import { ProductCollection } from '@/components/product-collection'

export default function BestSellersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductCollection title="Best Sellers" collectionType="best-sellers" />
    </Suspense>
  )
}
