'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useEffect, useState, FormEvent, KeyboardEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AUTH_STORAGE_KEY } from '@/lib/admin-auth'

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com',
    icon: '/inster.png',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com',
    icon: '/fb.png',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com',
    icon: '/tiktok.png',
  },
]

export function Header() {
  const { items } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsAdminLoggedIn(localStorage.getItem(AUTH_STORAGE_KEY) === 'true')
  }, [pathname])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    setSearchOpen(false)
    router.push(`/products?search=${encodeURIComponent(trimmed)}`)
  }

  const handleKeyboardAction = (event: KeyboardEvent<HTMLSpanElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  const isActiveCategory = (category: string) => {
    return pathname === `/${category}`
  }

  const isActiveSale = () => pathname === '/sale'
  const isActiveBestSellers = () => pathname === '/best-sellers'
  const isActiveAdmin = () => pathname.startsWith('/admin')
  const showAdminLink = isAdminLoggedIn && isActiveAdmin()

  const navItemClass = (active: boolean) =>
    `relative group text-foreground hover:text-primary transition ${active ? 'text-primary' : ''}`

  const underlineClass = (active: boolean) =>
    `absolute left-0 -bottom-1 h-0.5 w-full bg-primary transition-transform duration-300 origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
    }`

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-end gap-2">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center gap-2 overflow-hidden rounded-full border border-border bg-background transition-all duration-300 ${
              searchOpen ? 'w-56 sm:w-80 md:w-[28rem] px-3 py-1' : 'w-0 border-transparent px-0 py-1'
            }`}
          >
            <Search size={16} className="shrink-0 text-foreground" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </form>
          <div className="flex items-center gap-2">
            <span
              role="button"
              tabIndex={0}
              onClick={() => setSearchOpen((open) => !open)}
              onKeyDown={(event) => handleKeyboardAction(event, () => setSearchOpen((open) => !open))}
              aria-label="Toggle search"
              className="text-foreground hover:text-primary transition rounded-full p-1 hover:bg-background"
            >
              <Search size={16} />
            </span>
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                className="text-foreground hover:text-primary transition rounded-full p-1.5 hover:bg-background"
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="QINZI"
                width={240}
                height={90}
                className="h-24 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <Link href="/clothing" className={navItemClass(isActiveCategory('clothing'))}>
                  Clothing
                  <span className={underlineClass(isActiveCategory('clothing'))} />
                </Link>
                <Link href="/slippers" className={navItemClass(isActiveCategory('slippers'))}>
                  Slippers
                  <span className={underlineClass(isActiveCategory('slippers'))} />
                </Link>
                <Link href="/jewellery" className={navItemClass(isActiveCategory('jewellery'))}>
                  Jewellery
                  <span className={underlineClass(isActiveCategory('jewellery'))} />
                </Link>
                <Link href="/customisation" className={navItemClass(isActiveCategory('customisation'))}>
                  Customisation
                  <span className={underlineClass(isActiveCategory('customisation'))} />
                </Link>
                <Link href="/sale" className={navItemClass(isActiveSale())}>
                  SALE
                  <span className={underlineClass(isActiveSale())} />
                </Link>
                <Link href="/best-sellers" className={navItemClass(isActiveBestSellers())}>
                  Best Sellers
                  <span className={underlineClass(isActiveBestSellers())} />
                </Link>
                {showAdminLink && (
                  <Link href="/admin" className={navItemClass(isActiveAdmin())}>
                    Admin
                    <span className={underlineClass(isActiveAdmin())} />
                  </Link>
                )}
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <span
              role="button"
              tabIndex={0}
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onKeyDown={(event) => handleKeyboardAction(event, () => setIsMenuOpen((open) => !open))}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </span>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative ml-4 md:ml-8 p-2 hover:bg-secondary rounded-lg transition"
            >
              <ShoppingBag size={24} className="text-foreground" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              <Link
                href="/clothing"
                className="block px-4 py-2 text-foreground hover:bg-secondary rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Clothing
              </Link>
              <Link
                href="/slippers"
                className="block px-4 py-2 text-foreground hover:bg-secondary rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Slippers
              </Link>
              <Link
                href="/jewellery"
                className="block px-4 py-2 text-foreground hover:bg-secondary rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Jewellery
              </Link>
              <Link
                href="/customisation"
                className={`block px-4 py-2 transition rounded ${isActiveCategory('customisation') ? 'text-primary bg-secondary' : 'text-foreground hover:bg-secondary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Customisation
              </Link>
              <Link
                href="/sale"
                className={`block px-4 py-2 transition rounded ${isActiveSale() ? 'text-primary bg-secondary' : 'text-foreground hover:bg-secondary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                SALE
              </Link>
              <Link
                href="/best-sellers"
                className={`block px-4 py-2 transition rounded ${isActiveBestSellers() ? 'text-primary bg-secondary' : 'text-foreground hover:bg-secondary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Best Sellers
              </Link>
              {showAdminLink && (
                <Link
                  href="/admin"
                  className={`block px-4 py-2 transition rounded ${isActiveAdmin() ? 'text-primary bg-secondary' : 'text-foreground hover:bg-secondary'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
