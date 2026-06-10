import { Collection } from 'mongodb'
import { getDb } from './mongodb'
import { PRODUCTS } from './products'
import { Product } from './types'
import type { ManagedProduct } from './product-storage'

type ProductDocument = ManagedProduct & {
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

async function getProductsCollection(): Promise<Collection<ProductDocument>> {
  const db = await getDb()
  const collection = db.collection<ProductDocument>('products')
  await collection.createIndex({ id: 1 }, { unique: true })
  return collection
}

async function seedDefaultProducts() {
  const collection = await getProductsCollection()
  const now = new Date()

  await Promise.all(
    PRODUCTS.map((product) =>
      collection.updateOne(
        { id: product.id },
        {
          $setOnInsert: {
            ...product,
            source: 'default',
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true }
      )
    )
  )
}

function stripMongoFields(product: ProductDocument): ManagedProduct {
  const { createdAt, updatedAt, deletedAt, ...managedProduct } = product
  return managedProduct
}

export async function getMongoManagedProducts(): Promise<ManagedProduct[]> {
  await seedDefaultProducts()

  const collection = await getProductsCollection()
  const products = await collection.find({ deletedAt: { $exists: false } }, { projection: { _id: 0 } }).toArray()
  const productOrder = new Map(PRODUCTS.map((product, index) => [product.id, index]))

  return products
    .map(stripMongoFields)
    .sort((first, second) => {
      const firstOrder = productOrder.get(first.id) ?? Number.MAX_SAFE_INTEGER
      const secondOrder = productOrder.get(second.id) ?? Number.MAX_SAFE_INTEGER

      if (firstOrder !== secondOrder) return firstOrder - secondOrder
      return first.id.localeCompare(second.id)
    })
}

export async function saveMongoManagedProduct(product: Product, source: ManagedProduct['source']) {
  const collection = await getProductsCollection()
  const now = new Date()

  await collection.updateOne(
    { id: product.id },
    {
      $set: {
        ...product,
        source,
        updatedAt: now,
      },
      $unset: {
        deletedAt: '',
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  )
}

export async function deleteMongoManagedProduct(id: string) {
  const collection = await getProductsCollection()
  const now = new Date()

  await collection.updateOne(
    { id },
    {
      $set: {
        deletedAt: now,
        updatedAt: now,
      },
    }
  )
}
