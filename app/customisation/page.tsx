'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const CUSTOMISATION_REQUESTS_KEY = 'qinzi-customisation-requests'

export default function CustomisationPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const request = {
      id: `CUS-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'New',
    }

    const savedRequests = JSON.parse(localStorage.getItem(CUSTOMISATION_REQUESTS_KEY) || '[]')
    localStorage.setItem(CUSTOMISATION_REQUESTS_KEY, JSON.stringify([...savedRequests, request]))

    setSubmitted(true)
    setFormData({
      name: '',
      phone: '',
      address: '',
      note: '',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-secondary">
            <Image
              src="/custormization.jpeg"
              alt="Clothing customisation"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Custom Clothing
              </p>
              <h1 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Clothing customisation made for your style
              </h1>
            </div>

            <p className="text-base leading-7 text-muted-foreground">
              Share your idea with us and we will help shape it into a wearable design. Whether you need
              a custom outfit, special measurements, embroidery, fabric changes, colour matching, or a
              unique styling detail, QINZI can prepare clothing around your personal requirement.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="border border-border bg-secondary p-4">
                <p className="text-sm font-semibold text-foreground">Personal Fit</p>
                <p className="mt-2 text-xs text-muted-foreground">Made around your size and comfort.</p>
              </div>
              <div className="border border-border bg-secondary p-4">
                <p className="text-sm font-semibold text-foreground">Design Notes</p>
                <p className="mt-2 text-xs text-muted-foreground">Tell us colours, cuts, and details.</p>
              </div>
              <div className="border border-border bg-secondary p-4">
                <p className="text-sm font-semibold text-foreground">Customer Care</p>
                <p className="mt-2 text-xs text-muted-foreground">We contact you before confirming.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-secondary p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-foreground">Request Customisation</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Add your contact details and explain what you need. Include clothing type, preferred colour,
              fabric idea, measurements, date needed, or any design reference details.
            </p>
            <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-lg bg-background">
              <Image
                src="/custumizationimpg.png"
                alt="Custom clothing request"
                fill
                className="object-cover"
              />
            </div>
            {submitted && (
              <p className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                Your customisation request was submitted successfully.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-secondary p-6 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-foreground">Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Your full name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Phone Number</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  required
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Your phone number"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-foreground">Address</span>
              <textarea
                value={formData.address}
                onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                required
                rows={3}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Delivery or contact address"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-foreground">Customisation Details / Note</span>
              <textarea
                value={formData.note}
                onChange={(event) => setFormData({ ...formData, note: event.target.value })}
                required
                rows={6}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Write your clothing customisation needs here..."
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Submit Request
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
