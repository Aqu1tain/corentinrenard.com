<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

const { t, locale } = useI18n()
const colorMode = useColorMode()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const localeHead = useLocaleHead({ seo: true })

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
}))

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleLocale = () => {
  const nextLocale = locale.value === 'en' ? 'fr' : 'en'
  const nextPath = switchLocalePath(nextLocale).split('#')[0] || '/'
  navigateTo(nextPath)
}

const mobileMenu = ref<HTMLDetailsElement | null>(null)
const closeMobileMenu = () => {
  if (mobileMenu.value) mobileMenu.value.open = false
}

let smoother: ScrollSmoother | null = null
let effectTriggers: ScrollTrigger[] = []
let unhookEffects: (() => void) | undefined

const applyEffects = () => {
  effectTriggers.forEach((trigger) => trigger.kill())
  effectTriggers = smoother?.effects('[data-speed], [data-lag]') ?? []
}

const onAnchorClick = (event: MouseEvent) => {
  if (!smoother) return
  const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
  if (!anchor) return
  const target = document.querySelector(anchor.getAttribute('href') ?? '')
  if (!target) return
  event.preventDefault()
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  smoother.scrollTo(target, true, `top ${margin}px`)
  history.pushState(null, '', anchor.getAttribute('href') ?? '')
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
  smoother = ScrollSmoother.create({ smooth: 0.8 })
  applyEffects()
  unhookEffects = useNuxtApp().hook('page:transition:finish', applyEffects)
  document.addEventListener('click', onAnchorClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onAnchorClick)
  unhookEffects?.()
  effectTriggers.forEach((trigger) => trigger.kill())
  smoother?.kill()
  smoother = null
})
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 font-sans transition-colors">
    <AppLoader />
    <header class="site-header">
      <NuxtLink :to="localePath('/')" class="brand-mark" aria-label="Corentin Renard">
        <img src="/apple-touch-icon.png" alt="" />
      </NuxtLink>

      <nav class="header-nav" aria-label="Primary navigation">
        <NuxtLink :to="localePath({ path: '/', hash: '#works' })">{{ t('works.title') }}</NuxtLink>
        <NuxtLink :to="localePath({ path: '/', hash: '#process' })">{{ t('workflow.title') }}</NuxtLink>
        <a href="mailto:contact@corentinrenard.com">{{ t('nav.contact') }}</a>
      </nav>

      <div class="header-tools">
        <details ref="mobileMenu" class="mobile-menu">
          <summary class="utility-btn" :aria-label="t('nav.menu')">
            <Icon name="mdi:menu" class="w-5 h-5" />
          </summary>
          <nav class="mobile-menu-panel" aria-label="Mobile navigation" @click="closeMobileMenu">
            <NuxtLink :to="localePath({ path: '/', hash: '#works' })">{{ t('works.title') }}</NuxtLink>
            <NuxtLink :to="localePath({ path: '/', hash: '#process' })">{{ t('workflow.title') }}</NuxtLink>
            <a href="mailto:contact@corentinrenard.com">{{ t('nav.contact') }}</a>
          </nav>
        </details>
        <button
          class="utility-btn text-sm font-medium"
          :aria-label="t('language.toggle')"
          @click="toggleLocale"
        >
          {{ locale.toUpperCase() }}
        </button>
        <button
          class="utility-btn"
          :aria-label="t('theme.toggle')"
          @click="toggleTheme"
        >
          <Icon
            :name="colorMode.value === 'dark' ? 'mdi:weather-night' : 'mdi:weather-sunny'"
            class="w-5 h-5"
          />
        </button>
      </div>
    </header>

    <div id="smooth-wrapper" class="smooth-wrapper">
      <div id="smooth-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.smooth-wrapper {
  overflow-x: clip;
}

.site-header {
  position: fixed;
  top: 1rem;
  left: 50%;
  z-index: 50;
  display: grid;
  grid-template-columns: auto 1fr auto;
  width: min(calc(100% - 2rem), 72rem);
  align-items: center;
  gap: 0.75rem;
  transform: translateX(-50%);
  border: 1px solid var(--color-neutral-200);
  border-radius: 999px;
  padding: 0.35rem;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
}

.brand-mark,
.utility-btn {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
}

.brand-mark {
  background: var(--color-neutral-900);
  overflow: hidden;
  border: 1px solid var(--color-neutral-900);
  transition: border-color 0.2s ease;
}

.brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.12);
}

.header-nav {
  display: none;
  justify-content: center;
  gap: 0.35rem;
}

.header-nav a {
  border-radius: 999px;
  padding: 0.65rem 0.85rem;
  color: var(--color-neutral-500);
  font-size: 0.85rem;
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.header-nav a:hover {
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
}

.header-tools {
  position: relative;
  display: flex;
  gap: 0.25rem;
}

.utility-btn {
  border: 1px solid var(--color-neutral-200);
  background: var(--color-neutral-100);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.utility-btn:hover {
  border-color: var(--color-neutral-900);
  background: var(--color-neutral-200);
}

.mobile-menu {
  display: block;
}

.mobile-menu summary {
  list-style: none;
}

.mobile-menu summary::-webkit-details-marker {
  display: none;
}

.mobile-menu-panel {
  position: absolute;
  top: calc(100% + 0.55rem);
  right: 0;
  display: grid;
  min-width: 10rem;
  gap: 0.25rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 1rem;
  padding: 0.35rem;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 1rem 2.5rem rgba(23, 23, 23, 0.08);
  backdrop-filter: blur(18px);
}

.mobile-menu-panel a {
  border-radius: 0.75rem;
  padding: 0.7rem 0.85rem;
  color: var(--color-neutral-600);
  font-size: 0.9rem;
  font-weight: 700;
}

.mobile-menu-panel a:hover {
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
}

:where(.dark) .site-header {
  border-color: var(--color-neutral-800);
  background: rgba(23, 23, 23, 0.82);
}

:where(.dark) .brand-mark {
  border-color: var(--color-neutral-700);
  background: var(--color-neutral-100);
}

:where(.dark) .brand-mark:hover {
  border-color: var(--color-neutral-100);
}

:where(.dark) .header-nav a {
  color: var(--color-neutral-400);
}

:where(.dark) .header-nav a:hover,
:where(.dark) .utility-btn {
  border-color: var(--color-neutral-800);
  background: var(--color-neutral-800);
  color: var(--color-neutral-100);
}

:where(.dark) .utility-btn:hover {
  border-color: var(--color-neutral-100);
  background: var(--color-neutral-700);
}

:where(.dark) .mobile-menu-panel {
  border-color: var(--color-neutral-800);
  background: rgba(23, 23, 23, 0.92);
  box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.24);
}

:where(.dark) .mobile-menu-panel a {
  color: var(--color-neutral-300);
}

:where(.dark) .mobile-menu-panel a:hover {
  background: var(--color-neutral-800);
  color: var(--color-neutral-100);
}

@media (prefers-reduced-motion: reduce) {
  .brand-mark,
  .utility-btn {
    transition: none;
  }
}

@media (min-width: 720px) {
  .header-nav {
    display: flex;
  }

  .mobile-menu {
    display: none;
  }
}

@media (max-width: 719.98px) {
  .site-header {
    right: 1rem;
    left: auto;
    grid-template-columns: auto auto;
    width: max-content;
    max-width: calc(100% - 2rem);
    gap: 0.35rem;
    transform: none;
  }

  .header-tools {
    gap: 0.25rem;
  }
}
</style>
