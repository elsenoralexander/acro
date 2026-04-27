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
        tagline: 'Tejido a mano. Piedras del Cantábrico.',
        description:
          'Hilo natural trenzado a mano, punto a punto, adornado con piedras únicas recogidas en la costa vasca. No hay otra igual. Nunca habrá otra igual.',
        details: [
          'Crochet artesanal en hilo de algodón',
          'Piedras naturales únicas',
          'Asa de cuerda trenzada',
          'Interior en tela forrada',
          'Hecho en Donostia',
        ],
        world:
          'El 01 nace del mar. De la luz que rebota en el Cantábrico en agosto, de los guijarros pulidos por siglos de ola. Cada piedra que adorna este bolso es irrepetible — como la pieza que sostiene.',
      },
      en: {
        tagline: 'Hand-woven. Cantabrian stones.',
        description:
          'Natural yarn braided by hand, stitch by stitch, adorned with unique stones gathered on the Basque coast. There is no other like it. There never will be.',
        details: [
          'Artisanal crochet in cotton yarn',
          'Unique natural stones',
          'Braided rope handle',
          'Lined fabric interior',
          'Made in Donostia',
        ],
        world:
          'The 01 is born from the sea. From the light bouncing off the Cantabrian in August, from pebbles smoothed by centuries of waves. Each stone adorning this bag is unrepeatable — like the piece that holds them.',
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
        tagline: 'Acero y crochet. El contraste que nadie esperaba.',
        description:
          'Interior naranja. Exterior plateado. Hardware metálico. Cadena de acero. Esta pieza no pide permiso. La llevas con un Off-White, con un LV, con un Corteiz — o con lo que te dé la gana.',
        details: [
          'Crochet plateado artesanal',
          'Cadena metálica tipo baguette',
          'Interior en cuero sintético naranja',
          'Abalorios metálicos cosidos a mano',
          'Placa y llavero ACRO',
          'Cierre de cremallera',
          'Hecho en Donostia',
        ],
        world:
          'El 02 es la contradicción hecha objeto. La técnica más artesanal del mundo — el crochet de abuela — reinterpretada con el lenguaje del lujo contemporáneo. Metal frío, hilo plateado, naranja quemado. Una declaración de intenciones.',
      },
      en: {
        tagline: 'Steel and crochet. The contrast nobody expected.',
        description:
          'Orange interior. Silver exterior. Metal hardware. Steel chain. This piece asks no permission. Wear it with Off-White, LV, Corteiz — or whatever the hell you want.',
        details: [
          'Artisanal silver crochet',
          'Metal baguette chain',
          'Orange synthetic leather interior',
          'Hand-sewn metallic beads',
          'ACRO plate and keyring',
          'Zip closure',
          'Made in Donostia',
        ],
        world:
          'The 02 is contradiction made object. The world\'s most artisanal technique — grandma\'s crochet — reinterpreted through the language of contemporary luxury. Cold metal, silver yarn, burnt orange. A statement of intent.',
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
