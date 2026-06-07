'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_STORAGE_KEY } from '@/lib/admin-auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (localStorage.getItem(AUTH_STORAGE_KEY) === 'true') {
      router.replace('/admin')
    }
  }, [router])

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true')
      setLoginError('')
      router.replace('/admin')
      return
    }

    setLoginError('Invalid email or password. Please try again.')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-secondary border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-full bg-primary/10 text-primary p-3">
              <Lock size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Admin Login</h1>
              <p className="text-sm text-muted-foreground">Sign in to manage orders and products.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="text-sm text-muted-foreground">Admin Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="admin@niwera.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-muted-foreground">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter password"
                required
              />
            </label>

            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            Use <span className="text-foreground">admin@niwera.com</span> / <span className="text-foreground">Admin123</span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
