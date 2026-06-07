import { Product } from './types'

export function hasDiscount(product: Product) {
  return Boolean(product.discountPercentage && product.discountPercentage > 0)
}

export function getDiscountedPrice(product: Product) {
  if (!hasDiscount(product)) return product.price

  const discount = product.discountPercentage ?? 0
  return Math.round(product.price * (1 - discount / 100))
}

export function formatPrice(price: number) {
  return `Rs ${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
