import { Footer } from '@/components/Footer'
import { CollectionGrid } from '@/components/CollectionGrid'

export const metadata = {
  title: 'Colección — ACRO',
  description: 'Colección ACRO. Piezas únicas hechas a mano en Donostia. Una pieza, una vez.',
}

export default function ColeccionPage() {
  return (
    <>
      <CollectionGrid />
      <Footer />
    </>
  )
}
