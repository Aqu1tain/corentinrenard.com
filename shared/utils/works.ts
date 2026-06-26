export type WorkType = 'case-study' | 'mission' | 'personal'

export interface WorkItem {
  slug: string
  type: WorkType
  image?: string
  url?: string
  accent: string
  year: string
  stack: string[]
  published: boolean
}

export const workItems: WorkItem[] = [
  {
    slug: 'anaginosko',
    type: 'personal',
    image: '/works/anaginosko.jpg',
    url: 'https://anaginosko.fr',
    accent: '#0d3b66',
    year: '2026',
    stack: ['Next.js', 'React', 'Azure Speech'],
    published: true,
  },
  {
    slug: 'stremio-horizon',
    type: 'personal',
    image: '/works/stremio-horizon.jpg',
    url: 'https://stremio-horizon.akitain.fr',
    accent: '#7b5bf5',
    year: '2026',
    stack: ['JavaScript', 'Rust', 'Tauri'],
    published: true,
  },
  {
    slug: 'rosary-mysteries',
    type: 'personal',
    url: 'https://github.com/Aqu1tain/rosary-mysteries',
    accent: '#1d4e8f',
    year: '2026',
    stack: ['Kotlin', 'Android'],
    published: true,
  },
  {
    slug: 'les-chemins-du-pain',
    type: 'mission',
    image: '/works/les-chemins-du-pain.jpg',
    url: 'https://lescheminsdupain.com',
    accent: '#8a5a23',
    year: '2025',
    stack: ['UI/UX', 'Nuxt', 'Leaflet'],
    published: true,
  },
  {
    slug: 'sandjs',
    type: 'personal',
    url: 'https://github.com/Aqu1tain/sandjs',
    accent: '#0b7285',
    year: '2025',
    stack: ['TypeScript', 'SVG', 'npm'],
    published: true,
  },
  {
    slug: 'afc-des-landes',
    type: 'mission',
    image: '/works/afc-des-landes.jpg',
    url: 'https://afc40landes.fr',
    accent: '#e3005d',
    year: '2024',
    stack: ['UI/UX', 'PHP'],
    published: true,
  },
  {
    slug: 'coligny-paris',
    type: 'mission',
    image: '/works/coligny-paris.jpg',
    url: 'https://www.coligny-paris.com',
    accent: '#7d2b35',
    year: '2024',
    stack: ['WordPress', 'Elementor', 'TranslatePress'],
    published: true,
  },
  {
    slug: 'draner',
    type: 'mission',
    image: '/works/draner.jpg',
    url: 'https://www.draner.com',
    accent: '#3e6df0',
    year: '2023',
    stack: ['WordPress', 'Avada'],
    published: true,
  },
]

export const findWorkBySlug = (slug: string) => workItems.find((work) => work.slug === slug)
export const publishedWorkItems = workItems.filter((work) => work.published)
