export type WorkType = 'case-study' | 'mission' | 'personal'

export interface WorkItem {
  slug: string
  type: WorkType
  image?: string
  font?: string
}

export const workItems: WorkItem[] = [
  { slug: 'case-study', type: 'case-study', font: "'DM Serif Display', serif" },
  { slug: 'client-mission', type: 'mission' },
  { slug: 'personal-project', type: 'personal', font: 'monospace' },
]

export const findWorkBySlug = (slug: string) => workItems.find((work) => work.slug === slug)
