import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const applyVelocitySkew = (scope: HTMLElement, selector: string) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const targets = gsap.utils.toArray<HTMLElement>(selector, scope)
  if (!targets.length) return

  gsap.set(targets, { transformOrigin: 'center center' })
  const setSkew = gsap.quickSetter(targets, 'skewY', 'deg')
  const clampSkew = gsap.utils.clamp(-1.5, 1.5)
  const proxy = { skew: 0 }

  ScrollTrigger.create({
    onUpdate(self) {
      const skew = clampSkew(self.getVelocity() / -400)
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew
        gsap.to(proxy, {
          skew: 0,
          duration: 0.7,
          ease: 'power3',
          overwrite: true,
          onUpdate: () => setSkew(proxy.skew),
        })
      }
    },
  })
}
