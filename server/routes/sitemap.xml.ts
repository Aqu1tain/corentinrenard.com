import { SITE_URL } from '#shared/utils/site'
import { publishedWorkItems } from '#shared/utils/works'

const LOCALES = [
  { code: 'en', prefix: '' },
  { code: 'fr', prefix: '/fr' },
] as const

interface SitemapRoute {
  path: string
  priority: string
}

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const localizedUrl = (path: string, prefix: string) =>
  `${SITE_URL}${prefix}${path === '/' ? '' : path}`

const renderAlternates = (path: string) =>
  [
    ...LOCALES.map(({ code, prefix }) =>
      `    <xhtml:link rel="alternate" hreflang="${code}" href="${escapeXml(localizedUrl(path, prefix))}" />`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localizedUrl(path, ''))}" />`,
  ].join('\n')

const renderLocalizedUrl = ({ path, priority }: SitemapRoute, prefix: string) => [
  '  <url>',
  `    <loc>${escapeXml(localizedUrl(path, prefix))}</loc>`,
  renderAlternates(path),
  '    <changefreq>monthly</changefreq>',
  `    <priority>${priority}</priority>`,
  '  </url>',
].join('\n')

const renderRoute = (route: SitemapRoute) =>
  LOCALES.map(({ prefix }) => renderLocalizedUrl(route, prefix)).join('\n')

export default defineEventHandler((event) => {
  const workRoutes = publishedWorkItems.map((work) => `/works/${work.slug}`)
  const routes: SitemapRoute[] = [
    { path: '/', priority: '1.0' },
    ...workRoutes.map((path) => ({ path, priority: '0.7' })),
  ]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    routes.map(renderRoute).join('\n'),
    '</urlset>',
  ].join('\n')
})
