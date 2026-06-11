import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const tweens = new WeakMap<HTMLElement, gsap.core.Tween>()

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('reveal', {})
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  nuxtApp.hook('page:transition:finish', () => ScrollTrigger.refresh())

  let localeSwitching = false
  useRouter().beforeEach((to, from) => {
    localeSwitching = isLocaleSwitch(to, from)
  })

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    mounted(el, binding) {
      if (reduceMotion || localeSwitching) return
      gsap.set(el, { autoAlpha: 0, y: 20 })
      tweens.set(el, gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        delay: (binding.value ?? 0) / 1000,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      }))
    },
    unmounted(el) {
      const tween = tweens.get(el)
      tween?.scrollTrigger?.kill()
      tween?.kill()
      tweens.delete(el)
    },
  })
})
