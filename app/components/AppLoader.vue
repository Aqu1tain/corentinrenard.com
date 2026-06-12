<script setup lang="ts">
import { gsap } from 'gsap'

const visible = ref(true)
const progress = ref(0)
const loaderEl = ref<HTMLElement | null>(null)
const appLoaded = useState('app-loaded', () => false)

useHead({
  noscript: [{ innerHTML: '<style>.app-loader { display: none }</style>' }],
})

const loadImage = (src: string) => new Promise<void>((resolve) => {
  const img = new Image()
  img.onload = () => resolve()
  img.onerror = () => resolve()
  img.src = src
})

onMounted(() => {
  const tasks = [
    document.fonts.ready.then(() => {}),
    loadImage('/apple-touch-icon.png'),
    loadImage('/interview-thumbnail.png'),
  ]
  const allLoaded = Promise.race([
    Promise.all(tasks),
    new Promise((resolve) => setTimeout(resolve, 4000)),
  ])

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    allLoaded.then(() => {
      visible.value = false
      appLoaded.value = true
    })
    return
  }

  const state = { value: 0 }
  let done = 0
  const advance = () => {
    done += 1
    gsap.to(state, {
      value: done / tasks.length,
      duration: 0.5,
      ease: 'power1.out',
      onUpdate: () => { progress.value = Math.round(state.value * 100) },
    })
  }
  tasks.forEach((task) => task.then(advance))

  const minimumShown = new Promise((resolve) => setTimeout(resolve, 700))
  Promise.all([allLoaded, minimumShown]).then(() => {
    gsap.to(state, {
      value: 1,
      duration: 0.4,
      ease: 'power1.in',
      overwrite: true,
      onUpdate: () => { progress.value = Math.round(state.value * 100) },
      onComplete: () => {
        gsap.to(loaderEl.value, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power3.inOut',
          delay: 0.1,
          onComplete: () => {
            visible.value = false
            appLoaded.value = true
          },
        })
      },
    })
  })
})
</script>

<template>
  <div v-show="visible" ref="loaderEl" class="app-loader">
    <p class="app-loader-name">Corentin Renard</p>
    <p class="app-loader-count">{{ progress }}</p>
  </div>
</template>

<style scoped>
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: white;
}

.app-loader-name {
  color: var(--color-neutral-500);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.app-loader-count {
  font-family: var(--font-display), serif;
  font-size: clamp(4rem, 10vw, 6.5rem);
  line-height: 1;
  color: var(--color-neutral-900);
}

:where(.dark) .app-loader {
  background: var(--color-neutral-900);
}

:where(.dark) .app-loader-count {
  color: var(--color-neutral-100);
}
</style>
