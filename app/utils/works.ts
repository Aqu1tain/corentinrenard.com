export type WorkType = 'case-study' | 'mission' | 'personal'

export const workTypeMeta: Record<WorkType, { icon: string }> = {
  'case-study': { icon: 'mdi:file-document-outline' },
  mission: { icon: 'mdi:briefcase-outline' },
  personal: { icon: 'mdi:rocket-launch-outline' },
}

export interface WorkItem {
  slug: string
  type: WorkType
  image?: string
  font?: string
  size?: number
}

export const workItems: WorkItem[] = [
  { slug: 'case-study', type: 'case-study', size: 1.0, font: "'DM Serif Display', serif" },
  { slug: 'client-mission', type: 'mission', size: 2.0 },
  { slug: 'personal-project', type: 'personal', size: 1.4, font: 'monospace' },
]

export const findWorkBySlug = (slug: string) => workItems.find((work) => work.slug === slug)
