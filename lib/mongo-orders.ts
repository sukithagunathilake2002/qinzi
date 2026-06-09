import { Collection } from 'mongodb'
import { getDb } from './mongodb'
import { Order } from './types'

type OrderDocument = Order & {
  createdAt: Date
  updatedAt?: Date
}

async function getOrdersCollection(): Promise<Collection<OrderDocument>> {
  const db = await getDb()
  const collection = db.collection<OrderDocument>('orders')
  await collection.createIndex({ id: 1 }, { unique: true })
  await collection.createIndex({ createdAt: -1 })
  return collection
}

function stripMongoFields(order: OrderDocument): Order {
  const { _id, updatedAt, ...storedOrder } = order as OrderDocument & { _id?: unknown }
  return storedOrder
}

export async function getMongoOrders(): Promise<Order[]> {
  const collection = await getOrdersCollection()
  const orders = await collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray()
  return orders.map(stripMongoFields)
}

export async function createMongoOrder(order: Order) {
  const collection = await getOrdersCollection()
  await collection.insertOne({
    ...order,
    createdAt: new Date(order.createdAt),
    updatedAt: new Date(),
  })
}

export async function updateMongoOrderStatus(id: string, status: Order['status']) {
  const collection = await getOrdersCollection()
  await collection.updateOne(
    { id },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  )
}
