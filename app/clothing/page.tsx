import { Suspense } from 'react'
import { ProductCollection } from '@/components/product-collection'

export default function ClothingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductCollection title="Clothing" collectionType="category" category="Clothing" />
    </Suspense>
  )
}
