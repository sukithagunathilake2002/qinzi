import { NextRequest, NextResponse } from 'next/server'
import {
  getMongoManagedProducts,
  saveMongoManagedProduct,
} from '@/lib/mongo-products'
import { Product } from '@/lib/types'
import type { ManagedProduct } from '@/lib/product-storage'

export async function GET() {
  try {
    const products = await getMongoManagedProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to load products:', error)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { product: Product; source?: ManagedProduct['source'] }

    if (!body.product?.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await saveMongoManagedProduct(body.product, body.source ?? 'custom')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to save product:', error)
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 })
  }
}
