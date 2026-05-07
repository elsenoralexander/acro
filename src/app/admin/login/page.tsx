'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-bebas text-[9px] tracking-[0.6em] uppercase text-white/25 mb-2">
          ACRO · Acceso interno
        </p>
        <h1 className="font-bebas text-6xl text-white mb-10 leading-none">GESTIÓN</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full bg-transparent border border-white/20 text-white font-sans text-sm px-4 py-3 outline-none focus:border-white/60 transition-colors placeholder:text-white/20"
          />

          {error && (
            <p className="font-sans text-xs text-red-400 tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bebas text-xl tracking-[0.2em] py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
