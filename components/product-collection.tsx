'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { getStoredProducts } from '@/lib/product-storage'
import { getDiscountedPrice, hasDiscount } from '@/lib/pricing'
import { Product } from '@/lib/types'

const CLOTHING_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SLIPPER_SIZE_OPTIONS = ['5', '6', '7', '8', '9', '10']
const CATEGORIES = ['Clothing', 'Slippers', 'Jewellery', 'Customisation']

type CollectionType = 'all' | 'category' | 'sale' | 'best-sellers'

interface ProductCollectionProps {
  title?: string
  collectionType?: CollectionType
  category?: Product['category']
}

export function ProductCollection({
  title = 'Products',
  collectionType = 'all',
  category,
}: ProductCollectionProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchTerm = searchParams.get('search')?.toLowerCase() ?? ''
  const initialCategory = category ?? (categoryParam ? normalizeCategory(categoryParam) : null)

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Product['category'] | null>(initialCategory)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 30000])
  const [showFilters, setShowFilters] = useState(true)

  const lockedCategory = collectionType === 'category' ? category : null
  const activeCategory = lockedCategory ?? selectedCategory
  const isSlippersCategory = activeCategory === 'Slippers'
  const isJewelleryCategory = activeCategory === 'Jewellery'
  const isCustomisationCategory = activeCategory === 'Customisation'
  const allSizes = isSlippersCategory ? SLIPPER_SIZE_OPTIONS : CLOTHING_SIZE_OPTIONS

  useEffect(() => {
    getStoredProducts()
      .then(setAllProducts)
      .catch((error) => console.error('Failed to load products:', error))
      .finally(() => setIsLoadingProducts(false))
  }, [])

  useEffect(() => {
    setSelectedSizes((currentSizes) => currentSizes.filter((size) => allSizes.includes(size)))

    if (isSlippersCategory) {
      setSelectedColors([])
    }
  }, [allSizes, isSlippersCategory])

  const collectionProducts = useMemo(() => {
    if (collectionType === 'sale') {
      return allProducts.filter((product) => hasDiscount(product))
    }

    if (collectionType === 'best-sellers') {
      return allProducts.filter((product) => product.bestSelling).slice(0, 8)
    }

    return allProducts
  }, [allProducts, collectionType])

  const allColors = useMemo(() => {
    const colors = new Set<string>()

    allProducts
      .filter((product) => !activeCategory || product.category === activeCategory)
      .forEach((product) => {
        product.colors.forEach((color) => {
          const trimmedColor = color.trim()
          if (trimmedColor) colors.add(trimmedColor)
        })
      })

    return Array.from(colors).sort()
  }, [activeCategory, allProducts])

  const filteredProducts = useMemo(() => {
    return collectionProducts.filter((product) => {
      if (activeCategory && product.category !== activeCategory) {
        return false
      }

      if (!isSlippersCategory && selectedColors.length > 0) {
        const productColors = product.colors.map((color) => color.trim())
        const hasColor = selectedColors.some((color) => productColors.includes(color))
        if (!hasColor) return false
      }

      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((size) => product.sizes.includes(size))
        if (!hasSize) return false
      }

      const displayPrice = getDiscountedPrice(product)

      if (displayPrice < priceRange[0] || displayPrice > priceRange[1]) {
        return false
      }

      if (searchTerm) {
        const lowerName = product.name.toLowerCase()
        const lowerDescription = product.description.toLowerCase()

        if (!lowerName.includes(searchTerm) && !lowerDescription.includes(searchTerm)) {
          return false
        }
      }

      return true
    })
  }, [
    activeCategory,
    collectionProducts,
    isSlippersCategory,
    priceRange,
    searchTerm,
    selectedColors,
    selectedSizes,
  ])

  const resetFilters = () => {
    if (!lockedCategory) {
      setSelectedCategory(null)
    }

    setSelectedColors([])
    setSelectedSizes([])
    setPriceRange([0, 30000])
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((selectedColor) => selectedColor !== color) : [...prev, color]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((selectedSize) => selectedSize !== size) : [...prev, size]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">{title}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {!isCustomisationCategory && (
          <div className="lg:w-64 flex-shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-secondary rounded-lg mb-4"
            >
              <span className="font-semibold">Filters</span>
              <ChevronDown size={20} className={`transition ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="space-y-6">
                {!lockedCategory && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Category</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`block w-full text-left px-3 py-2 rounded transition ${
                          selectedCategory === null ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                        }`}
                      >
                        All Products
                      </button>
                      {CATEGORIES.map((item) => (
                        <button
                          key={item}
                          onClick={() => setSelectedCategory(item as Product['category'])}
                          className={`block w-full text-left px-3 py-2 rounded transition ${
                            selectedCategory === item ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!isSlippersCategory && allColors.length > 0 && (
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-foreground mb-3">Color</h3>
                    <div className="space-y-2">
                      {allColors.map((color) => (
                        <label key={color} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(color)}
                            onChange={() => toggleColor(color)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-muted-foreground">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {!isJewelleryCategory && (
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-foreground mb-3">Size</h3>
                    <div className="space-y-2">
                      {allSizes.map((size) => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => toggleSize(size)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-muted-foreground">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-3">Price</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      value={priceRange[0]}
                      onChange={(event) =>
                        setPriceRange([Math.min(Number(event.target.value), priceRange[1]), priceRange[1]])
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      value={priceRange[1]}
                      onChange={(event) =>
                        setPriceRange([priceRange[0], Math.max(Number(event.target.value), priceRange[0])])
                      }
                      className="w-full"
                    />
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>Rs {priceRange[0].toLocaleString()}</span>
                      <span>-</span>
                      <span>Rs {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 border border-border rounded-lg hover:bg-secondary transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          )}

          <div className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {collectionProducts.length} products
              </p>
            </div>

            {isLoadingProducts ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function normalizeCategory(category: string): Product['category'] | null {
  const match = CATEGORIES.find((item) => item.toLowerCase() === category.toLowerCase())
  return (match as Product['category'] | undefined) ?? null
}
