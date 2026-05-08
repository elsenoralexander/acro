import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import { CartProvider } from '@/components/CartProvider'
import { Header } from '@/components/Header'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ACRO Donostia',
  description: 'ACRO Donostia',
  keywords: ['bolsos', 'donostia', 'moda', 'único', 'ACRO'],
  openGraph: {
    title: 'ACRO Donostia',
    description: 'ACRO Donostia',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="grain">
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
