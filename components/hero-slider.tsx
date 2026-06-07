'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    title: 'Elegant Clothing Collection',
    description: 'Discover premium fabrics and sophisticated designs',
    category: 'Clothing',
    image: '/slider3.png',
    href: '/clothing',
  },
  {
    id: 2,
    title: 'Luxury Slippers',
    description: 'Comfort meets elegance in every step',
    category: 'Slippers',
    image: '/slipimage%20.png',
    textColor: 'text-gray-800',
    href: '/slippers',
  },
  {
    id: 3,
    title: 'Exquisite Jewelry',
    description: 'Timeless pieces that celebrate your style',
    category: 'Jewellery',
    image: '/juslider.jpg',
    href: '/jewellery',
  },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoplay])

  const goToSlide = (index: number) => {
    setCurrent(index)
    setIsAutoplay(false)
  }

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoplay(false)
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setIsAutoplay(false)
  }

  const handleKeyboardAction = (event: KeyboardEvent<HTMLSpanElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  return (
    <div
      className="relative min-w-screen w-full h-96 sm:h-[500px] md:h-[600px] overflow-hidden group"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8">
            <div className="animate-slide-up space-y-4">
              <p className={`text-sm md:text-base font-semibold uppercase tracking-widest ${slide.textColor ?? 'text-white/80'}`}>
                {slide.category}
              </p>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-balance ${slide.textColor ?? 'text-white'}`}>
                {slide.title}
              </h2>
              <p className={`text-base md:text-lg max-w-md mx-auto text-pretty ${slide.textColor ?? 'text-white/90'}`}>
                {slide.description}
              </p>
              <Link
                href={slide.href}
                className="inline-block mt-6 px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-opacity-90 transition transform hover:scale-105"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <span
        role="button"
        tabIndex={0}
        onClick={goToPrevious}
        onKeyDown={(event) => handleKeyboardAction(event, goToPrevious)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition transform hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </span>

      <span
        role="button"
        tabIndex={0}
        onClick={goToNext}
        onKeyDown={(event) => handleKeyboardAction(event, goToNext)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition transform hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </span>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            role="button"
            tabIndex={0}
            onClick={() => goToSlide(index)}
            onKeyDown={(event) => handleKeyboardAction(event, () => goToSlide(index))}
            className={`inline-block h-2 rounded-full transition ${index === current ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/75'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
