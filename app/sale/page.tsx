import { Suspense } from 'react'
import { ProductCollection } from '@/components/product-collection'
import { getMongoManagedProducts } from '@/lib/mongo-products'

export const dynamic = 'force-dynamic'

export default async function SalePage() {
  const products = await getMongoManagedProducts()

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductCollection title="SALE" collectionType="sale" initialProducts={products} />
    </Suspense>
  )
}
