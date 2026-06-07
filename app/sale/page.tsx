import { Suspense } from 'react'
import { ProductCollection } from '@/components/product-collection'

export default function SalePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductCollection title="SALE" collectionType="sale" />
    </Suspense>
  )
}
