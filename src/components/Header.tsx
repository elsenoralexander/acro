'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart'
import { usePathname } from 'next/navigation'

export function Header() {
  const { count } = useCart()
  const pathname = usePathname()
  // Home es CLARO (blanco); /coleccion/02 es OSCURO
  const isDark = pathname.startsWith('/coleccion/02')

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
      style={{ mixBlendMode: 'normal' }}
    >
      <Link href="/" className="flex items-center">
        <Image
          src={isDark ? '/images/logo-white.png' : '/images/logo-black.png'}
          alt="ACRO"
          width={80}
          height={40}
          className="h-8 w-auto object-contain"
          priority
        />
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/coleccion"
          className={`text-xs tracking-[0.3em] uppercase font-sans transition-opacity hover:opacity-60 ${
            isDark ? 'text-chalk' : 'text-ink'
          }`}
        >
          Colección
        </Link>
        <Link
          href="/carrito"
          className={`text-xs tracking-[0.3em] uppercase font-sans transition-opacity hover:opacity-60 relative ${
            isDark ? 'text-chalk' : 'text-ink'
          }`}
        >
          Carrito
          {count > 0 && (
            <span className="absolute -top-2 -right-3 w-4 h-4 rounded-full bg-current text-[10px] flex items-center justify-center">
              <span className={isDark ? 'text-ink' : 'text-chalk'}>{count}</span>
            </span>
          )}
        </Link>
      </nav>

      {/* Mobile cart */}
      <Link href="/carrito" className="md:hidden relative">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDark ? '#F5F5F0' : '#0A0A0A'}
          strokeWidth="1.5"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-current text-[9px] flex items-center justify-center">
            <span className={isDark ? 'text-ink' : 'text-chalk'}>{count}</span>
          </span>
        )}
      </Link>
    </header>
  )
}
