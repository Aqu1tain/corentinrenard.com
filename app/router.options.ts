import type { RouterConfig } from '@nuxt/schema'

const splitLocaleRoute = (name: unknown) => String(name ?? '').split('___')

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      const el = document.querySelector(to.hash)
      const top = el ? Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0
      return { el: to.hash, top }
    }

    const [toBase, toLocale] = splitLocaleRoute(to.name)
    const [fromBase, fromLocale] = splitLocaleRoute(from.name)
    if (toBase && toBase === fromBase && toLocale !== fromLocale) return false

    return { top: 0 }
  },
}
