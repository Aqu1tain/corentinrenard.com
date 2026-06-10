import { SITE_URL } from '#shared/utils/site'

interface SeoInput {
  title: () => string
  description: () => string
  type?: 'website' | 'article'
  path?: () => string
  robots?: () => string
}

const OG_IMAGE = `${SITE_URL}/og-image.png`

export const usePageSeo = (input: SeoInput) => {
  const { t, locale } = useI18n()
  const localizedUrl = useLocalizedUrl()
  const name = () => t('name')
  const url = () => localizedUrl(input.path?.() ?? '/')

  useSeoMeta({
    title: input.title,
    description: input.description,
    ogTitle: () => `${input.title()} - ${name()}`,
    ogDescription: input.description,
    ogImage: OG_IMAGE,
    ogType: input.type ?? 'website',
    ogUrl: url,
    twitterCard: 'summary_large_image',
    twitterTitle: () => `${input.title()} - ${name()}`,
    twitterDescription: input.description,
    twitterImage: OG_IMAGE,
  })

  useHead({
    htmlAttrs: { lang: () => locale.value },
    link: [
      {
        rel: 'canonical',
        href: url,
      },
    ],
    meta: input.robots
      ? [
          {
            name: 'robots',
            content: input.robots,
          },
        ]
      : [],
  })
}
