import { Suspense } from 'react'
import { ProductCollection } from '@/components/product-collection'

export default function SlippersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductCollection title="Slippers" collectionType="category" category="Slippers" />
    </Suspense>
  )
}
