import { Suspense } from 'react'
import { ProductCollection } from '@/components/product-collection'

export default function JewelleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductCollection title="Jewellery" collectionType="category" category="Jewellery" />
    </Suspense>
  )
}
