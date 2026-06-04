interface SeoInput {
  title: () => string
  description: () => string
  type?: 'website' | 'article'
  path?: () => string
}

const SITE = 'https://corentinrenard.com'
const OG_IMAGE = `${SITE}/og-image.png`

export const usePageSeo = (input: SeoInput) => {
  const { t, locale } = useI18n()
  const name = () => t('name')

  useSeoMeta({
    title: input.title,
    description: input.description,
    ogTitle: () => `${input.title()} - ${name()}`,
    ogDescription: input.description,
    ogImage: OG_IMAGE,
    ogType: input.type ?? 'website',
    ogUrl: () => `${SITE}${input.path?.() ?? ''}`,
    twitterCard: 'summary_large_image',
    twitterTitle: () => `${input.title()} - ${name()}`,
    twitterDescription: input.description,
    twitterImage: OG_IMAGE,
  })

  useHead({
    htmlAttrs: { lang: () => locale.value },
  })
}
