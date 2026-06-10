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
    slug: 'case-study',
    type: 'case-study',
    accent: '#3554d1',
    year: '2026',
    stack: ['Strategy', 'UI/UX', 'Nuxt'],
    published: false,
  },
  {
    slug: 'client-mission',
    type: 'mission',
    accent: '#18a058',
    year: '2026',
    stack: ['Figma', 'Integration', 'Support'],
    published: false,
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
