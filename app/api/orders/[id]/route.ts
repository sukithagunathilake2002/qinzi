import { NextRequest, NextResponse } from 'next/server'
import { updateMongoOrderStatus } from '@/lib/mongo-orders'
import { Order } from '@/lib/types'

const ORDER_STATUSES: Order['status'][] = ['Pending', 'Accepted', 'Rejected']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json() as { status?: Order['status'] }

    if (!body.status || !ORDER_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Valid order status is required' }, { status: 400 })
    }

    await updateMongoOrderStatus(id, body.status)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
