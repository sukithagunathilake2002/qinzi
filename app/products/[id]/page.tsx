'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { getStoredProducts } from '@/lib/product-storage'
import { formatPrice, getDiscountedPrice, hasDiscount } from '@/lib/pricing'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'
import { useEffect, useState } from 'react'
import { Heart, ShoppingBag, ArrowLeft, X } from 'lucide-react'

export default function ProductPage() {
    const params = useParams()
    const id = params.id as string
    const { addItem } = useCart()
    const [products, setProducts] = useState(PRODUCTS)
    const product = products.find((p) => p.id === id)
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [addedToBag, setAddedToBag] = useState(false)
    const [showSizeGuide, setShowSizeGuide] = useState(false)
    const isDiscounted = product ? hasDiscount(product) : false
    const salePrice = product ? getDiscountedPrice(product) : 0

    useEffect(() => {
        getStoredProducts()
            .then(setProducts)
            .catch((error) => console.error('Failed to load products:', error))
    }, [])

    useEffect(() => {
        if (!product) return

        setSelectedSize(product.sizes[0] ?? '')
        setSelectedColor(product.colors[0] ?? '')
        setQuantity(1)
        setAddedToBag(false)
    }, [product?.id])

    const handleAddToBag = () => {
        if (!product) return

        addItem(product, quantity, selectedColor || undefined, selectedSize || undefined)
        setAddedToBag(true)
    }

    const handleKeyboardAction = (event: React.KeyboardEvent<HTMLSpanElement>, action: () => void) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            action()
        }
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Product Not Found</h1>
                    <Link href="/products" className="text-primary hover:underline">
                        Back to products
                    </Link>
                </div>
            </div>
        )
    }

    const relatedProducts = products.filter(
        (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 3)

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition mb-8"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-semibold">Back</span>
                    </Link>

                    {/* Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Image */}
                        <div className="relative aspect-[4/5] bg-secondary rounded-none overflow-hidden">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            {isDiscounted && (
                                <div className="absolute left-4 top-4 z-10 space-y-1">
                                    <span className="block bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                                        -{product.discountPercentage}%
                                    </span>
                                    {product.available && (
                                        <span className="block bg-teal-600 px-3 py-1 text-sm font-semibold text-white">
                                            In stock
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <div>
                                <p className="text-[0.5rem] tracking-[0.35em] uppercase text-muted-foreground mb-2">
                                    {product.category}
                                </p>
                                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
                                    {product.name}
                                </h1>
                                <div className="flex flex-wrap items-baseline gap-3">
                                    {isDiscounted && (
                                        <span className="text-base text-red-600 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                    <p className="text-2xl font-serif font-bold text-primary">
                                        {formatPrice(salePrice)}
                                    </p>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    Size
                                </label>
                                <div className="flex gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded transition ${selectedSize === size
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border text-foreground hover:border-primary'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    Color
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`min-h-10 rounded-full border-2 px-4 text-sm transition ${selectedColor === color
                                                ? 'border-primary'
                                                : 'border-border hover:border-primary'
                                                }`}
                                            title={color}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                                {product.category === 'Clothing' && (
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setShowSizeGuide(true)}
                                        onKeyDown={(event) => handleKeyboardAction(event, () => setShowSizeGuide(true))}
                                        className="mt-4 inline-flex cursor-pointer items-center gap-2 border-b border-foreground text-sm font-semibold uppercase tracking-wide text-foreground transition hover:text-primary"
                                    >
                                        <Image
                                            src="/hangericon.png"
                                            alt=""
                                            width={18}
                                            height={18}
                                            className="h-[18px] w-[18px] object-contain"
                                        />
                                        Size Guide
                                    </span>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    Quantity
                                </label>
                                <div className="flex items-center border border-border rounded w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 hover:bg-secondary transition"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-2 border-l border-r border-border">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-2 hover:bg-secondary transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleAddToBag}
                                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={20} />
                                    {addedToBag ? 'Added to bag' : 'Add to bag'}
                                </button>
                                <button className="bg-secondary text-foreground px-6 py-3 rounded-full font-semibold hover:bg-secondary/80 transition flex items-center justify-center gap-2">
                                    <Heart size={20} />
                                </button>
                            </div>

                            {/* Description */}
                            <div className="border-t border-border pt-6">
                                <p className="text-sm text-foreground leading-relaxed">
                                    {product.description || 'High-quality product crafted with attention to detail. Perfect for everyday wear and special occasions.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* You May Also Like */}
                    {relatedProducts.length > 0 && (
                        <div className="border-t border-border pt-12">
                            <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-8">
                                You may also like
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedProducts.map((item) => (
                                    <Link key={item.id} href={`/products/${item.id}`} className="group">
                                        <div className="relative aspect-[4/5] bg-secondary rounded-none overflow-hidden mb-4">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <p className="text-[0.5rem] tracking-[0.35em] uppercase text-muted-foreground text-center mb-1">
                                            {item.category}
                                        </p>
                                        <h3 className="font-serif text-xs sm:text-sm text-foreground font-semibold text-center">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm font-serif font-bold text-primary text-center">
                                            {formatPrice(getDiscountedPrice(item))}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {showSizeGuide && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                    <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background p-6 shadow-xl">
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={() => setShowSizeGuide(false)}
                            onKeyDown={(event) => handleKeyboardAction(event, () => setShowSizeGuide(false))}
                            aria-label="Close size guide"
                            className="absolute right-4 top-4 cursor-pointer rounded-full p-2 text-foreground transition hover:bg-secondary"
                        >
                            <X size={22} />
                        </span>
                        <h2 className="pr-10 text-center font-serif text-2xl font-bold text-foreground">
                            PLEASE FIND THE GENERAL SIZE CHART AS BELOW
                        </h2>
                        <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-lg bg-secondary">
                            <Image
                                src="/sizechart.png"
                                alt="General clothing size chart"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}
