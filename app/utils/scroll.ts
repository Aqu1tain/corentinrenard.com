import type { RouteLocationNormalized } from 'vue-router'

const splitLocaleRoute = (name: unknown) => String(name ?? '').split('___')

export const isLocaleSwitch = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const [toBase, toLocale] = splitLocaleRoute(to.name)
  const [fromBase, fromLocale] = splitLocaleRoute(from.name)
  return Boolean(toBase) && toBase === fromBase && toLocale !== fromLocale
}

export const scrollToTopUnlessLocaleSwitch = (to: RouteLocationNormalized, from: RouteLocationNormalized) =>
  !isLocaleSwitch(to, from)
