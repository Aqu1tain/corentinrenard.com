// French moved from /fr to the root when it became the default locale.
// Permanently redirect the old URLs so shared links and indexed pages keep working.
// (A routeRules redirect would be localized by @nuxtjs/i18n into /en/fr and prerendered.)
export default defineEventHandler((event) => {
  const { pathname, search } = getRequestURL(event)
  if (pathname !== '/fr' && !pathname.startsWith('/fr/')) return

  const target = pathname.slice(3) || '/'
  return sendRedirect(event, target + search, 301)
})
