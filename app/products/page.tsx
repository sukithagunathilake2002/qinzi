import { Suspense } from 'react'
import { ProductCollection } from '@/components/product-collection'

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductCollection title="All Products" />
    </Suspense>
  )
}
