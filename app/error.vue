<script setup lang="ts">
import type { NuxtError } from '#app'
import { gsap } from 'gsap'

const props = defineProps<{ error: NuxtError }>()

const { t, locale } = useI18n()
const localePath = useLocalePath()

const is404 = computed(() => props.error.statusCode === 404)
const digits = computed(() => String(props.error.statusCode ?? 500).split(''))
const kicker = computed(() => is404.value
  ? t('error.notFoundKicker')
  : `${t('error.errorKicker')} ${props.error.statusCode}`)

useHead({ htmlAttrs: { lang: () => locale.value } })
useSeoMeta({
  title: kicker,
  robots: 'noindex',
})

const pageEl = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!pageEl.value) return
  ctx = gsap.context(() => {
    gsap.timeline()
      .from('.error-glyph', { yPercent: 120, duration: 0.6, ease: 'power3.out', stagger: 0.09 })
      .from('.error-capy-wrap', { scale: 0, rotate: -24, duration: 0.7, ease: 'back.out(1.8)' }, 0.2)
      .from(['.error-kicker', '.error-message', '.error-home'], { autoAlpha: 0, y: 16, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, 0.35)
    gsap.to('.error-capy-wrap', { y: -8, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 })
  }, pageEl.value)
})

onUnmounted(() => ctx?.revert())

const goHome = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <div ref="pageEl" class="error-page">
    <main class="error-shell">
      <p class="error-kicker">{{ kicker }}</p>

      <h1 class="error-code" :aria-label="String(error.statusCode)">
        <template v-if="is404">
          <span class="error-mask"><span class="error-glyph">4</span></span>
          <span class="error-capy-wrap" aria-hidden="true">
            <img src="/apple-touch-icon.png" alt="" class="error-capy" />
          </span>
          <span class="error-mask"><span class="error-glyph">4</span></span>
        </template>
        <template v-else>
          <span v-for="(digit, i) in digits" :key="i" class="error-mask">
            <span class="error-glyph">{{ digit }}</span>
          </span>
        </template>
      </h1>

      <p class="error-message">{{ is404 ? t('error.notFound') : t('error.generic') }}</p>

      <button class="error-home" @click="goHome">
        <Icon name="mdi:arrow-left" size="18" />
        <span>{{ t('error.home') }}</span>
      </button>
    </main>
  </div>
</template>

<style scoped>
.error-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 2rem 1.25rem;
  background:
    linear-gradient(var(--color-neutral-100) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-neutral-100) 1px, transparent 1px),
    white;
  background-size: 28px 28px, 28px 28px, auto;
  color: var(--color-neutral-900);
  font-family: var(--font-sans), sans-serif;
}

.error-shell {
  display: grid;
  justify-items: center;
  gap: 1.25rem;
  text-align: center;
}

.error-kicker {
  color: var(--color-neutral-500);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.error-code {
  display: inline-flex;
  align-items: center;
  gap: 0.06em;
  font-family: var(--font-display), serif;
  font-size: clamp(7rem, 26vw, 15rem);
  line-height: 0.9;
}

.error-mask {
  display: inline-block;
  overflow: clip;
}

.error-glyph {
  display: inline-block;
}

.error-mask:first-child .error-glyph {
  color: #3554d1;
}

.error-mask:last-child .error-glyph {
  color: #d6336c;
}

.error-capy-wrap {
  display: inline-flex;
  width: 0.74em;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border: 3px solid var(--color-neutral-900);
  border-radius: 999px;
  background: var(--color-neutral-900);
}

.error-capy {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.12);
}

.error-message {
  max-width: 26rem;
  color: var(--color-neutral-600);
  line-height: 1.7;
}

.error-home {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.5rem;
  border: 1px solid var(--color-neutral-900);
  border-radius: 999px;
  padding: 0.8rem 1.3rem;
  background: var(--color-neutral-900);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.error-home:hover {
  background: var(--color-neutral-700);
}

:where(.dark) .error-page {
  background:
    linear-gradient(var(--color-neutral-800) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-neutral-800) 1px, transparent 1px),
    var(--color-neutral-900);
  background-size: 28px 28px, 28px 28px, auto;
  color: var(--color-neutral-100);
}

:where(.dark) .error-kicker {
  color: var(--color-neutral-400);
}

:where(.dark) .error-message {
  color: var(--color-neutral-300);
}

:where(.dark) .error-capy-wrap {
  border-color: var(--color-neutral-100);
}

:where(.dark) .error-home {
  border-color: var(--color-neutral-100);
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
}

:where(.dark) .error-home:hover {
  background: var(--color-neutral-300);
}
</style>
