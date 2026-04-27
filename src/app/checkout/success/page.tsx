'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart'

export default function SuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-ink text-chalk flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/images/logo-white.png"
        alt="ACRO"
        width={100}
        height={50}
        className="h-12 w-auto object-contain mb-16"
      />

      <div className="unique-stamp border-chalk text-chalk mb-10">
        Pieza Única · Confirmada
      </div>

      <h1 className="font-bebas text-[12vw] md:text-7xl leading-none mb-6">GRACIAS</h1>

      <p className="font-sans text-sm text-chalk/50 max-w-sm leading-relaxed mb-3">
        Tu pieza ACRO está confirmada. Te enviaremos un correo con los detalles del envío.
      </p>
      <p className="font-sans text-xs text-chalk/30 max-w-sm leading-relaxed mb-16 italic">
        Your ACRO piece is confirmed. We will send you an email with shipping details.
      </p>

      <p className="font-sans text-xs text-chalk/20 max-w-xs leading-relaxed mb-12">
        Recuerda: esta era la única pieza. No habrá otra igual.
        <br />
        <em>Remember: this was the only piece. There will never be another like it.</em>
      </p>

      <Link
        href="/coleccion"
        className="font-bebas text-xl tracking-[0.2em] border-2 border-chalk/30 text-chalk/60 px-10 py-4 hover:border-chalk hover:text-chalk transition-all duration-300"
      >
        Ver Colección
      </Link>
    </div>
  )
}
