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

  const localeSwitching = useState('locale-switching', () => false)
  useRouter().beforeEach((to, from) => {
    localeSwitching.value = isLocaleSwitch(to, from)
  })

  const appLoaded = useState('app-loaded', () => false)
  let pendingReveals: Array<() => void> = []
  watch(appLoaded, (loaded) => {
    if (!loaded) return
    pendingReveals.forEach((arm) => arm())
    pendingReveals = []
  })

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    mounted(el, binding) {
      if (reduceMotion || localeSwitching.value) return
      gsap.set(el, { autoAlpha: 0, y: 20 })
      const arm = () => {
        if (!el.isConnected) return
        const inView = el.getBoundingClientRect().top < window.innerHeight * 0.82
        tweens.set(el, gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          delay: (binding.value ?? 0) / 1000,
          ease: 'power2.out',
          ...(inView
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: 'clamp(top 82%)',
                  once: true,
                },
              }),
        }))
      }
      if (appLoaded.value) arm()
      else pendingReveals.push(arm)
    },
    unmounted(el) {
      const tween = tweens.get(el)
      tween?.scrollTrigger?.kill()
      tween?.kill()
      tweens.delete(el)
    },
  })
})
