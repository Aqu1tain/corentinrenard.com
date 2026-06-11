export default defineNuxtRouteMiddleware((to, from) => {
  to.meta.pageTransition = isLocaleSwitch(to, from)
    ? false
    : { name: 'page', mode: 'out-in' }
})
