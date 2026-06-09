import { NextRequest, NextResponse } from 'next/server'
import { deleteMongoManagedProduct } from '@/lib/mongo-products'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteMongoManagedProduct(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
