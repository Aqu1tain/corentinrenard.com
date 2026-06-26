import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const tweens = new WeakMap<HTMLElement, gsap.core.Tween>()

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('reveal', {})
    return
  }

  gsap.registerPlugin(ScrollTrigger)
  nuxtApp.hook('page:transition:finish', () => ScrollTrigger.refresh())

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const localeSwitching = useState('locale-switching', () => false)
  useRouter().beforeEach((to, from) => {
    localeSwitching.value = isLocaleSwitch(to, from)
  })

  const delays = new WeakMap<HTMLElement, number>()

  // Reveal on real on-screen visibility. IntersectionObserver tracks the
  // element's actual rendered position (transforms included), so it never gets
  // stuck on stale scroll math the way pre-computed triggers can on mobile when
  // the page height shifts (images, the URL bar). The small bottom margin keeps
  // a touch of delay without leaving the last elements unreachable.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const el = entry.target as HTMLElement
      observer.unobserve(el)
      tweens.set(el, gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        delay: (delays.get(el) ?? 0) / 1000,
        ease: 'power2.out',
      }))
    }
  }, { rootMargin: '0px 0px -10% 0px' })

  const appLoaded = useState('app-loaded', () => false)
  let queued: HTMLElement[] = []
  watch(appLoaded, (loaded) => {
    if (!loaded) return
    queued.forEach((el) => el.isConnected && observer.observe(el))
    queued = []
  })

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    mounted(el, binding) {
      if (reduceMotion || localeSwitching.value) return
      delays.set(el, binding.value ?? 0)
      gsap.set(el, { autoAlpha: 0, y: 20 })
      if (appLoaded.value) observer.observe(el)
      else queued.push(el)
    },
    unmounted(el) {
      observer.unobserve(el)
      tweens.get(el)?.kill()
      tweens.delete(el)
    },
  })
})
