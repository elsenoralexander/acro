export function finalPrice(basePrice: number, discount: number): number {
  if (!discount || discount <= 0) return basePrice
  return Math.round(basePrice * (1 - discount / 100) * 100) / 100
}
