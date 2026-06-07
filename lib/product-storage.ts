import { PRODUCTS } from './products'
import { Product } from './types'

const CUSTOM_PRODUCTS_KEY = 'niwera-products'
const PRODUCT_OVERRIDES_KEY = 'qinzi-product-overrides'
const DELETED_PRODUCT_IDS_KEY = 'qinzi-deleted-product-ids'

export type ManagedProduct = Product & {
  source: 'default' | 'custom'
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch (error) {
    console.error(`Failed to load ${key}:`, error)
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getCustomProducts(): Product[] {
  return readJson<Product[]>(CUSTOM_PRODUCTS_KEY, [])
}

function getProductOverrides(): Record<string, Product> {
  return readJson<Record<string, Product>>(PRODUCT_OVERRIDES_KEY, {})
}

function getDeletedProductIds(): string[] {
  return readJson<string[]>(DELETED_PRODUCT_IDS_KEY, [])
}

export function getManagedProducts(): ManagedProduct[] {
  const overrides = getProductOverrides()
  const deletedProductIds = new Set(getDeletedProductIds())

  const defaultProducts = PRODUCTS
    .filter((product) => !deletedProductIds.has(product.id))
    .map((product) => ({
      ...product,
      ...overrides[product.id],
      source: 'default' as const,
    }))

  const customProducts = getCustomProducts().map((product) => ({
    ...product,
    source: 'custom' as const,
  }))

  return [...defaultProducts, ...customProducts]
}

export function getStoredProducts(): Product[] {
  return getManagedProducts().map(({ source, ...product }) => product)
}

export function saveManagedProduct(product: Product, source: ManagedProduct['source']) {
  if (source === 'default') {
    const overrides = getProductOverrides()
    writeJson(PRODUCT_OVERRIDES_KEY, {
      ...overrides,
      [product.id]: product,
    })
    return
  }

  const customProducts = getCustomProducts()
  const existingIndex = customProducts.findIndex((item) => item.id === product.id)
  const updatedProducts = existingIndex >= 0
    ? customProducts.map((item) => (item.id === product.id ? product : item))
    : [...customProducts, product]

  writeJson(CUSTOM_PRODUCTS_KEY, updatedProducts)
}

export function deleteManagedProduct(product: ManagedProduct) {
  if (product.source === 'default') {
    const deletedProductIds = new Set(getDeletedProductIds())
    deletedProductIds.add(product.id)
    writeJson(DELETED_PRODUCT_IDS_KEY, Array.from(deletedProductIds))
    return
  }

  const updatedProducts = getCustomProducts().filter((item) => item.id !== product.id)
  writeJson(CUSTOM_PRODUCTS_KEY, updatedProducts)
}
