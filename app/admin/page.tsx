'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Order, Product } from '@/lib/types'
import { CheckCircle, XCircle, Clock, Eye, X, LogOut, Edit, Trash2, Plus, Upload } from 'lucide-react'
import { AUTH_STORAGE_KEY } from '@/lib/admin-auth'
import { formatPrice, getDiscountedPrice } from '@/lib/pricing'
import {
  deleteManagedProduct,
  getManagedProducts,
  ManagedProduct,
  saveManagedProduct,
} from '@/lib/product-storage'

const AVAILABLE_SIZE_OPTIONS = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
]
const SLIPPER_SIZE_OPTIONS = ['5', '6', '7', '8', '9', '10']

const EMPTY_PRODUCT_FORM = {
  id: '',
  name: '',
  category: 'Clothing',
  price: '',
  discountPercentage: '',
  bestSelling: false,
  description: '',
  colors: '',
  sizes: [] as string[],
  sizeQuantities: {} as Record<string, string>,
  fabric: '',
  modelHeight: '',
  note: '',
  image: '',
}

type AdminTab = 'orders' | 'products' | 'add-product'
type ProductCategory = Product['category']

const CATEGORY_ID_PREFIXES: Record<ProductCategory, string> = {
  Clothing: 'CLOT',
  Slippers: 'SLIP',
  Jewellery: 'JEWE',
  Customisation: 'CUSA',
}

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('orders')
  const [managedProducts, setManagedProducts] = useState<ManagedProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<ManagedProduct | null>(null)
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM)
  const activeSizeOptions = productForm.category === 'Slippers' ? SLIPPER_SIZE_OPTIONS : AVAILABLE_SIZE_OPTIONS
  const showSizeFields = productForm.category !== 'Jewellery'
  const showColorField = productForm.category !== 'Jewellery'
  const showClothingDetailFields = productForm.category !== 'Slippers' && productForm.category !== 'Jewellery'

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY)

    if (auth !== 'true') {
      router.replace('/admin/login')
      setAuthChecked(true)
      return
    }

    setIsLoggedIn(true)
    setAuthChecked(true)

    const savedOrders = localStorage.getItem('niwera-orders')
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (e) {
        console.error('Failed to load orders:', e)
      }
    }

    setManagedProducts(getManagedProducts())
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsLoggedIn(false)
    router.replace('/admin/login')
  }

  const resetProductForm = () => {
    setProductForm({
      ...EMPTY_PRODUCT_FORM,
      id: generateProductId(EMPTY_PRODUCT_FORM.category as ProductCategory),
    })
    setEditingProduct(null)
  }

  const generateProductId = (category: ProductCategory) => {
    const prefix = CATEGORY_ID_PREFIXES[category]
    const highestNumber = managedProducts.reduce((highest, product) => {
      if (!product.id.startsWith(prefix)) return highest

      const suffix = Number(product.id.replace(prefix, ''))
      return Number.isFinite(suffix) ? Math.max(highest, suffix) : highest
    }, 0)

    return `${prefix}${String(highestNumber + 1).padStart(4, '0')}`
  }

  const handleCategoryChange = (category: ProductCategory) => {
    setProductForm((current) => ({
      ...current,
      category,
      id: generateProductId(category),
      sizes: [],
      sizeQuantities: {},
      colors: category === 'Jewellery' ? '' : current.colors,
      fabric: category === 'Slippers' || category === 'Jewellery' ? '' : current.fabric,
      modelHeight: category === 'Slippers' || category === 'Jewellery' ? '' : current.modelHeight,
    }))
  }

  const buildProductFromForm = (): Product | null => {
    if (!productForm.id || !productForm.name || !productForm.price) {
      alert('Please fill in all required fields')
      return null
    }

    const discountPercentage = productForm.discountPercentage ? Number(productForm.discountPercentage) : 0
    if (discountPercentage < 0 || discountPercentage > 100) {
      alert('Discount percentage must be between 0 and 100')
      return null
    }

    const selectedSizes = showSizeFields ? activeSizeOptions.filter((size) => productForm.sizes.includes(size)) : []
    const missingQuantity = selectedSizes.some((size) => !productForm.sizeQuantities[size])

    if (missingQuantity) {
      alert('Please enter quantities for all selected sizes')
      return null
    }

    return {
      id: productForm.id,
      name: productForm.name,
      category: productForm.category as Product['category'],
      price: parseFloat(productForm.price),
      discountPercentage,
      bestSelling: productForm.bestSelling,
      image: productForm.image || 'https://via.placeholder.com/400x500?text=Product',
      colors: showColorField ? productForm.colors.split(',').map((color) => color.trim()).filter(Boolean) : [],
      sizes: selectedSizes,
      sizeQuantities: selectedSizes.reduce<Record<string, number>>((quantities, size) => {
        quantities[size] = Number(productForm.sizeQuantities[size])
        return quantities
      }, {}),
      description: productForm.description,
      available: true,
    }
  }

  const handleSaveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const product = buildProductFromForm()
    if (!product) return

    const duplicateProduct = managedProducts.find((item) => item.id === product.id)
    if (!editingProduct && duplicateProduct) {
      alert('A product with this ID already exists')
      return
    }

    if (editingProduct && duplicateProduct && duplicateProduct.id !== editingProduct.id) {
      alert('A product with this ID already exists')
      return
    }

    if (editingProduct && product.id !== editingProduct.id) {
      deleteManagedProduct(editingProduct)
      saveManagedProduct(product, 'custom')
    } else {
      saveManagedProduct(product, editingProduct?.source ?? 'custom')
    }

    setManagedProducts(getManagedProducts())
    alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!')
    resetProductForm()
    setActiveTab('products')
  }

  const handleEditProduct = (product: ManagedProduct) => {
    setEditingProduct(product)
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price),
      discountPercentage: product.discountPercentage ? String(product.discountPercentage) : '',
      bestSelling: Boolean(product.bestSelling),
      description: product.description,
      colors: product.colors.join(', '),
      sizes: product.sizes,
      sizeQuantities: Object.fromEntries(
        product.sizes.map((size) => [size, String(product.sizeQuantities?.[size] ?? '')])
      ),
      fabric: '',
      modelHeight: '',
      note: '',
      image: product.image,
    })
    setActiveTab('add-product')
  }

  const handleDeleteProduct = (product: ManagedProduct) => {
    const confirmed = window.confirm(`Delete ${product.name}?`)
    if (!confirmed) return

    deleteManagedProduct(product)
    setManagedProducts(getManagedProducts())
  }

  const handleStatusChange = (orderId: string, status: 'Pending' | 'Accepted' | 'Rejected') => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    )

    setOrders(updatedOrders)
    localStorage.setItem('niwera-orders', JSON.stringify(updatedOrders))
  }

  const handleSizeToggle = (size: string) => {
    setProductForm((current) => {
      if (current.sizes.includes(size)) {
        const remainingQuantities = { ...current.sizeQuantities }
        delete remainingQuantities[size]

        return {
          ...current,
          sizes: current.sizes.filter((selectedSize) => selectedSize !== size),
          sizeQuantities: remainingQuantities,
        }
      }

      return {
        ...current,
        sizes: [...current.sizes, size],
      }
    })
  }

  const handleSizeQuantityChange = (size: string, quantity: string) => {
    setProductForm((current) => ({
      ...current,
      sizeQuantities: {
        ...current.sizeQuantities,
        [size]: quantity,
      },
    }))
  }

  const handleProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProductForm((current) => ({
          ...current,
          image: reader.result as string,
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders
  const selectedProductSizes = activeSizeOptions.filter((size) => productForm.sizes.includes(size))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle size={20} className="text-green-600" />
      case 'Rejected':
        return <XCircle size={20} className="text-red-600" />
      default:
        return <Clock size={20} className="text-yellow-600" />
    }
  }

  if (!authChecked || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm text-muted-foreground">Loading admin dashboard...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-2">Review orders and manage products from the secure admin panel.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-sm text-foreground transition hover:bg-secondary/90"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 font-semibold transition ${activeTab === 'orders'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 font-semibold transition ${activeTab === 'products'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Products
          </button>
          <button
            onClick={() => {
              resetProductForm()
              setActiveTab('add-product')
            }}
            className={`px-4 py-3 font-semibold transition ${activeTab === 'add-product'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Add Product
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-secondary rounded-lg p-6">
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-foreground">{orders.length}</p>
              </div>
              <div className="bg-secondary rounded-lg p-6">
                <p className="text-muted-foreground text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === 'Pending').length}
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-6">
                <p className="text-muted-foreground text-sm">Accepted</p>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter((o) => o.status === 'Accepted').length}
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-6">
                <p className="text-muted-foreground text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {orders.filter((o) => o.status === 'Rejected').length}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setFilterStatus(null)}
                className={`px-4 py-2 rounded-lg transition ${filterStatus === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-opacity-80'
                  }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilterStatus('Pending')}
                className={`px-4 py-2 rounded-lg transition ${filterStatus === 'Pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-secondary hover:bg-opacity-80'
                  }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('Accepted')}
                className={`px-4 py-2 rounded-lg transition ${filterStatus === 'Accepted'
                  ? 'bg-green-600 text-white'
                  : 'bg-secondary hover:bg-opacity-80'
                  }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setFilterStatus('Rejected')}
                className={`px-4 py-2 rounded-lg transition ${filterStatus === 'Rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-secondary hover:bg-opacity-80'
                  }`}
              >
                Rejected
              </button>
            </div>

            <div className="bg-secondary rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 font-semibold text-foreground">Order ID</th>
                      <th className="text-left px-6 py-3 font-semibold text-foreground">Customer</th>
                      <th className="text-left px-6 py-3 font-semibold text-foreground">Email</th>
                      <th className="text-left px-6 py-3 font-semibold text-foreground">Items</th>
                      <th className="text-left px-6 py-3 font-semibold text-foreground">Total</th>
                      <th className="text-left px-6 py-3 font-semibold text-foreground">Status</th>
                      <th className="text-left px-6 py-3 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-background/50 transition">
                          <td className="px-6 py-4 text-sm text-foreground font-mono">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{order.customerName}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{order.customerEmail}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{order.items.length}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-primary">
                            Rs {order.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span
                                className={`text-sm font-semibold ${order.status === 'Accepted'
                                  ? 'text-green-600'
                                  : order.status === 'Rejected'
                                    ? 'text-red-600'
                                    : 'text-yellow-600'
                                  }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowModal(true)
                              }}
                              className="text-primary hover:text-primary/80 transition flex items-center gap-1"
                            >
                              <Eye size={16} /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-secondary rounded-lg overflow-hidden border border-border">
            <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Products</h2>
                <p className="text-sm text-muted-foreground">Edit default products or delete products from the storefront.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetProductForm()
                  setActiveTab('add-product')
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-b border-border bg-background/40">
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Product</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Category</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Price</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Discount</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Best Selling</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Source</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managedProducts.map((product) => (
                    <tr key={`${product.source}-${product.id}`} className="border-b border-border hover:bg-background/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-14 w-12 rounded bg-background object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        Rs {product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {product.discountPercentage ? `${product.discountPercentage}%` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {product.bestSelling ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
                          {product.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary"
                          >
                            <Edit size={15} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === 'add-product' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-secondary rounded-lg p-8 border border-border">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      resetProductForm()
                      setActiveTab('products')
                    }}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Category */}
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Category</span>
                  <select
                    value={productForm.category}
                    onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option>Clothing</option>
                    <option>Slippers</option>
                    <option>Jewellery</option>
                    <option>Customisation</option>
                  </select>
                </label>

                {/* Item ID */}
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Item ID *</span>
                  <input
                    type="text"
                    value={productForm.id}
                    readOnly
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Select category to generate ID"
                    required
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    IDs generate automatically from category prefixes: CLOT, SLIP, JEWE, CUSA.
                  </p>
                </label>

                {/* Item Name */}
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Item Name *</span>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g., Premium Casual Shirt"
                    required
                  />
                </label>

                {/* Price */}
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Price (Rs) *</span>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g., 2500"
                    required
                  />
                </label>

                {/* Discount */}
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Discount Percentage</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={productForm.discountPercentage}
                    onChange={(e) => setProductForm({ ...productForm, discountPercentage: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g., 30"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Leave empty or use 0 for regular products. Add a value to show this product as a sale item.
                  </p>
                </label>

                {/* Best Selling */}
                <label className="flex min-h-[72px] cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition hover:border-primary/60">
                  <input
                    type="checkbox"
                    checked={productForm.bestSelling}
                    onChange={(e) => setProductForm({ ...productForm, bestSelling: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>
                    <span className="block font-semibold">Best Selling Product</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Check this to show the product in Best Sellers.
                    </span>
                  </span>
                </label>

                {/* Available Sizes */}
                {showSizeFields && (
                  <fieldset className="md:col-span-2">
                    <legend className="text-sm font-semibold text-foreground">Available Sizes</legend>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {activeSizeOptions.map((size) => (
                        <label
                          key={size}
                          className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition hover:border-primary/60"
                        >
                          <input
                            type="checkbox"
                            checked={productForm.sizes.includes(size)}
                            onChange={() => handleSizeToggle(size)}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {/* Size Quantities */}
                {showSizeFields && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-foreground">Size Quantities</h3>
                    <div className="mt-2 overflow-hidden rounded-lg border border-border bg-background">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-secondary">
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 font-semibold text-foreground">Size</th>
                            <th className="px-4 py-3 font-semibold text-foreground">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProductSizes.length > 0 ? (
                            selectedProductSizes.map((size) => (
                              <tr key={size} className="border-b border-border last:border-b-0">
                                <td className="px-4 py-3 font-medium text-foreground">{size}</td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    min="0"
                                    value={productForm.sizeQuantities[size] || ''}
                                    onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder={`Qty for ${size}`}
                                    required
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="px-4 py-4 text-center text-muted-foreground">
                                Select available sizes to add quantities
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Available Colours */}
                {showColorField && (
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">Available Colours (comma-separated)</span>
                    <input
                      type="text"
                      value={productForm.colors}
                      onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g., black, white, red"
                    />
                  </label>
                )}

                {showClothingDetailFields && (
                  <>
                    {/* Fabric */}
                    <label className="block">
                      <span className="text-sm font-semibold text-foreground">Fabric</span>
                      <input
                        type="text"
                        value={productForm.fabric}
                        onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g., 100% Cotton, Cotton Blend"
                      />
                    </label>

                    {/* Model Height */}
                    <label className="block">
                      <span className="text-sm font-semibold text-foreground">Model Height</span>
                      <input
                        type="text"
                        value={productForm.modelHeight}
                        onChange={(e) => setProductForm({ ...productForm, modelHeight: e.target.value })}
                        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g., 5 feet 7 inches"
                      />
                    </label>
                  </>
                )}

                {/* Note */}
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Note</span>
                  <textarea
                    value={productForm.note}
                    onChange={(e) => setProductForm({ ...productForm, note: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Additional notes about the product..."
                    rows={3}
                  />
                </label>

                {/* Description */}
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-foreground">Description</span>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Product description..."
                    rows={4}
                  />
                </label>

                {/* Product Image */}
                <div className="space-y-3 md:col-span-2">
                  <span className="text-sm font-semibold text-foreground">Product Image</span>
                  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
                    <Upload size={20} />
                    <span>Upload product image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs text-muted-foreground">Or paste image URL</span>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="https://example.com/product.jpg"
                    />
                  </label>

                  {productForm.image && (
                    <div className="rounded-lg border border-border bg-background p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">Image Preview</p>
                        <button
                          type="button"
                          onClick={() => setProductForm((current) => ({ ...current, image: '' }))}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          Remove Image
                        </button>
                      </div>
                      <div className="relative mx-auto aspect-[4/5] max-w-64 overflow-hidden rounded-lg bg-secondary">
                        <img
                          src={productForm.image}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 transition md:col-span-2"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background">
                <h2 className="text-2xl font-serif font-bold text-foreground">Order Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-secondary rounded transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      <span className="text-foreground">{selectedOrder.customerName}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="text-foreground">{selectedOrder.customerEmail}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="text-primary font-semibold">
                          {formatPrice(getDiscountedPrice(item.product) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.bankDetails && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Bank Details</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Account:</span>{' '}
                        <span className="text-foreground">{selectedOrder.bankDetails.accountName}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Bank:</span>{' '}
                        <span className="text-foreground">{selectedOrder.bankDetails.bankName}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Update Status</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, 'Pending')
                        setSelectedOrder({ ...selectedOrder, status: 'Pending' })
                      }}
                      className={`px-4 py-2 rounded-lg transition ${selectedOrder.status === 'Pending'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-secondary hover:bg-opacity-80'
                        }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, 'Accepted')
                        setSelectedOrder({ ...selectedOrder, status: 'Accepted' })
                      }}
                      className={`px-4 py-2 rounded-lg transition ${selectedOrder.status === 'Accepted'
                        ? 'bg-green-600 text-white'
                        : 'bg-secondary hover:bg-opacity-80'
                        }`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, 'Rejected')
                        setSelectedOrder({ ...selectedOrder, status: 'Rejected' })
                      }}
                      className={`px-4 py-2 rounded-lg transition ${selectedOrder.status === 'Rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-secondary hover:bg-opacity-80'
                        }`}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg font-bold text-foreground">Order Total:</span>
                    <span className="text-2xl font-serif font-bold text-primary">
                      Rs {selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
