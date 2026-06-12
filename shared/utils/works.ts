export type WorkType = 'case-study' | 'mission' | 'personal'

export interface WorkItem {
  slug: string
  type: WorkType
  image?: string
  accent: string
  year: string
  stack: string[]
  published: boolean
}

export const workItems: WorkItem[] = [
  {
    slug: 'les-chemins-du-pain',
    type: 'case-study',
    image: '/works/les-chemins-du-pain.jpg',
    accent: '#8a5a23',
    year: '2025',
    stack: ['UI/UX', 'Nuxt', 'Leaflet'],
    published: true,
  },
  {
    slug: 'afc-des-landes',
    type: 'mission',
    image: '/works/afc-des-landes.jpg',
    accent: '#e3005d',
    year: '2024',
    stack: ['UI/UX', 'PHP'],
    published: true,
  },
  {
    slug: 'personal-project',
    type: 'personal',
    accent: '#f06a2b',
    year: 'Lab',
    stack: ['Product', 'Prototype', 'Full stack'],
    published: false,
  },
]

export const findWorkBySlug = (slug: string) => workItems.find((work) => work.slug === slug)
export const publishedWorkItems = workItems.filter((work) => work.published)
