'use client'

import { createContext, useContext } from 'react'
import type { Product } from './products'

export type CartItem = {
  product: Product
  quantity: number
}

export type CartContextType = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
  count: number
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
})

export function useCart() {
  return useContext(CartContext)
}
