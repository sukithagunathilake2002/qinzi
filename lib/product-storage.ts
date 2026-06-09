import { Product } from './types'

export type ManagedProduct = Product & {
  source: 'default' | 'custom'
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getManagedProducts(): Promise<ManagedProduct[]> {
  return fetchJson<ManagedProduct[]>('/api/products')
}

export async function getStoredProducts(): Promise<Product[]> {
  const products = await getManagedProducts()
  return products.map(({ source, ...product }) => product)
}

export async function saveManagedProduct(product: Product, source: ManagedProduct['source']) {
  await fetchJson<{ ok: boolean }>('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product, source }),
  })
}

export async function deleteManagedProduct(product: ManagedProduct) {
  await fetchJson<{ ok: boolean }>(`/api/products/${encodeURIComponent(product.id)}`, {
    method: 'DELETE',
  })
}
