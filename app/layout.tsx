import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import { WhatsAppFloatingButton } from '@/components/whatsapp-floating-button'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'QINZI',
  description: 'Discover luxury clothing, slippers, jewelry, and custom designs at QINZI',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7f5' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <WhatsAppFloatingButton />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
