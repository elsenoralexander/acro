export type Product = {
  id: string
  number: string
  price: number
  stripeProductId?: string
  images: {
    main: string
    views: string[]
  }
  shooting: string[]
  copy: {
    es: {
      tagline: string
      description: string
      details: string[]
      world: string
    }
    en: {
      tagline: string
      description: string
      details: string[]
      world: string
    }
  }
  theme: {
    bg: string
    text: string
    accent: string
  }
}

export const products: Product[] = [
  {
    id: '01',
    number: '01',
    price: 120,
    images: {
      main: '/images/product-01.png',
      views: ['/images/product-01.png'],
    },
    shooting: [
      '/images/shoot-01-1.jpg',
      '/images/shoot-01-2.jpg',
      '/images/shoot-01-3.jpg',
      '/images/shoot-01-4.jpg',
      '/images/shoot-01-5.jpg',
    ],
    copy: {
      es: {
        tagline: 'Piedras únicas. Hilo natural. Una sola vez.',
        description:
          'Tejida a mano, punto a punto, con piedras recogidas en la costa vasca. No hay catálogo. No hay serie. Esta pieza existe una vez.',
        details: [
          'Hilo de algodón natural',
          'Piedras únicas de la costa vasca',
          'Asa de cuerda trenzada',
          'Interior en tela forrada',
          'Hecho en Donostia',
        ],
        world:
          'El 01 nace del mar. De la luz que rebota en el Cantábrico en agosto, de los guijarros pulidos por siglos de ola. Cada piedra es irrepetible — como la pieza que la sostiene.',
      },
      en: {
        tagline: 'Unique stones. Natural yarn. Just once.',
        description:
          'Woven by hand, stitch by stitch, with stones gathered on the Basque coast. No catalogue. No series. This piece exists once.',
        details: [
          'Natural cotton yarn',
          'Unique stones from the Basque coast',
          'Braided rope handle',
          'Lined fabric interior',
          'Made in Donostia',
        ],
        world:
          'The 01 is born from the sea. From the light bouncing off the Cantabrian in August, from pebbles smoothed by centuries of waves. Each stone is unrepeatable — like the piece that holds it.',
      },
    },
    theme: {
      bg: '#F5EFE0',
      text: '#1A1208',
      accent: '#C8A96E',
    },
  },
  {
    id: '02',
    number: '02',
    price: 210,
    images: {
      main: '/images/product-02.png',
      views: ['/images/product-02.png'],
    },
    shooting: [
      '/images/shoot-02-1.jpg',
      '/images/shoot-02-2.jpg',
      '/images/shoot-02-3.jpg',
      '/images/shoot-02-4.jpg',
      '/images/shoot-02-5.jpg',
      '/images/shoot-02-6.jpg',
    ],
    copy: {
      es: {
        tagline: 'Metal frío. Interior naranja. Una declaración.',
        description:
          'Exterior plateado. Hardware metálico. Interior naranja quemado. Esta pieza no necesita contexto. La llevas con Off-White, con LV, con Corteiz — o con lo que te dé la gana.',
        details: [
          'Hilo plateado tejido a mano',
          'Cadena metálica',
          'Interior en cuero sintético naranja',
          'Abalorios metálicos cosidos a mano',
          'Placa y llavero ACRO',
          'Cierre de cremallera',
          'Hecho en Donostia',
        ],
        world:
          'El 02 es la contradicción hecha objeto. Metal frío, hilo plateado, naranja quemado. Lo que las máquinas no pueden hacer — y el mercado no puede duplicar.',
      },
      en: {
        tagline: 'Cold metal. Orange interior. A statement.',
        description:
          'Silver exterior. Metal hardware. Burnt orange interior. This piece needs no context. Wear it with Off-White, LV, Corteiz — or whatever you want.',
        details: [
          'Silver yarn woven by hand',
          'Metal chain',
          'Orange synthetic leather interior',
          'Hand-sewn metallic beads',
          'ACRO plate and keyring',
          'Zip closure',
          'Made in Donostia',
        ],
        world:
          'The 02 is contradiction made object. Cold metal, silver yarn, burnt orange. What machines cannot make — and the market cannot duplicate.',
      },
    },
    theme: {
      bg: '#0A0A0A',
      text: '#F5F5F0',
      accent: '#C0C0C0',
    },
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
