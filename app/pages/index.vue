<script setup lang="ts">
const { t, locale, setLocale } = useI18n()
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleLocale = () => {
  setLocale(locale.value === 'en' ? 'fr' : 'en')
}

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => `${t('name')} - ${t('seo.title')}`,
  ogDescription: () => t('seo.description'),
  ogImage: 'https://corentinrenard.com/og-image.png',
  ogType: 'website',
  ogUrl: 'https://corentinrenard.com',
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${t('name')} - ${t('seo.title')}`,
  twitterDescription: () => t('seo.description'),
  twitterImage: 'https://corentinrenard.com/og-image.png',
})

useHead({
  htmlAttrs: { lang: () => locale.value },
})

const socials = [
  { icon: 'mdi:instagram', href: 'https://www.instagram.com/corentin_fox/', label: 'Instagram' },
  { icon: 'mdi:github', href: 'https://github.com/Aqu1tain', label: 'GitHub' },
  { icon: 'mdi:discord', label: 'Discord', action: 'copy', value: 'Akitain' },
  { icon: 'mdi:email', href: 'mailto:contact@corentinrenard.com', label: 'Email' },
  { icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/corentin-renard-web/', label: 'LinkedIn' },
  { icon: 'mdi:behance', href: 'https://www.behance.net/corentin_fox', label: 'Behance' },
]

const copiedSocial = ref<string | null>(null)
const handleSocialClick = async (social: typeof socials[number]) => {
  if (social.action !== 'copy' || !social.value) return
  await navigator.clipboard.writeText(social.value)
  copiedSocial.value = social.label
  setTimeout(() => copiedSocial.value = null, 2000)
}

const hoveredSocial = ref<string | null>(null)
const isTooltipVisible = (label: string) => hoveredSocial.value === label || copiedSocial.value === label
const getTooltipText = (social: typeof socials[number]) => {
  if (copiedSocial.value === social.label) return 'Copied!'
  return social.label
}

const workflowSteps = [
  { key: 'design', icon: 'mdi:palette-outline' },
  { key: 'integration', icon: 'mdi:code-braces' },
  { key: 'maintenance', icon: 'mdi:wrench-outline' },
]

const pricingTypes = ['landing', 'showcase', 'ecommerce', 'custom'] as const

const showVideo = ref(false)

const isDesktop = ref(false)
let mediaQuery: MediaQueryList | null = null

onMounted(() => {
  mediaQuery = window.matchMedia('(min-width: 640px)')
  isDesktop.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onMediaChange)
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', onMediaChange)
})

const onMediaChange = (e: MediaQueryListEvent) => {
  isDesktop.value = e.matches
}
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 font-sans transition-colors">
    <header class="fixed top-0 right-0 p-4 sm:p-6 flex gap-2 z-50">
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
        @click="toggleLocale"
      >
        {{ locale.toUpperCase() }}
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        @click="toggleTheme"
      >
        <Icon
          :name="colorMode.value === 'dark' ? 'mdi:weather-night' : 'mdi:weather-sunny'"
          class="w-5 h-5"
        />
      </button>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-24 sm:py-32">
      <section class="text-center mb-24">
        <img
          src="/apple-touch-icon.png"
          alt="Corentin Renard"
          class="w-36 h-36 rounded-full mx-auto mb-8 object-cover ring-4 ring-neutral-100 dark:ring-neutral-700"
        />
        <h1 class="font-display text-4xl sm:text-5xl mb-3">{{ t('name') }}</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-3">{{ t('role') }}</p>
        <p class="text-sm text-neutral-400 dark:text-neutral-600 italic">{{ t('avatarJoke') }}</p>

        <div class="flex justify-center gap-2 mt-10">
          <component
            :is="social.href ? 'a' : 'button'"
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            :target="social.href ? '_blank' : undefined"
            :rel="social.href ? 'noopener noreferrer' : undefined"
            :aria-label="social.label"
            class="social-btn"
            @click="handleSocialClick(social)"
            @mouseenter="hoveredSocial = social.label"
            @mouseleave="hoveredSocial = null"
          >
            <Transition v-if="social.action === 'copy'" name="icon-swap" mode="out-in">
              <Icon v-if="copiedSocial === social.label" key="check" name="mdi:check" size="24" class="text-green-500" />
              <Icon v-else key="icon" :name="social.icon" size="24" />
            </Transition>
            <Icon v-else :name="social.icon" size="24" />
            <span class="social-tooltip" :class="{ visible: isTooltipVisible(social.label) }">
              {{ getTooltipText(social) }}
            </span>
          </component>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="font-display text-2xl sm:text-3xl mb-10 text-center">{{ t('workflow.title') }}</h2>
        <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
          <template v-for="(step, index) in workflowSteps" :key="step.key">
            <div class="workflow-card">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center text-sm font-semibold shrink-0">
                  {{ index + 1 }}
                </span>
                <Icon :name="step.icon" size="24" class="text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 class="font-semibold mb-2">{{ t(`workflow.steps.${step.key}.title`) }}</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {{ t(`workflow.steps.${step.key}.description`) }}
              </p>
            </div>
            <div v-if="index < workflowSteps.length - 1" class="flex justify-center py-1 sm:py-0 sm:px-1">
              <Icon v-show="!isDesktop" name="mdi:chevron-down" size="20" class="text-neutral-400 dark:text-neutral-500" />
              <Icon v-show="isDesktop" name="mdi:chevron-right" size="20" class="text-neutral-400 dark:text-neutral-500" />
            </div>
          </template>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="font-display text-2xl sm:text-3xl mb-2 text-center">{{ t('pricing.title') }}</h2>
        <p class="text-sm text-neutral-500 text-center mb-10">{{ t('pricing.subtitle') }}</p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div
            v-for="type in pricingTypes"
            :key="type"
            class="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
          >
            <h3 class="font-semibold text-neutral-600 dark:text-neutral-400 mb-2">{{ t(`pricing.types.${type}.title`) }}</h3>
            <p class="text-2xl font-semibold">
              {{ t(`pricing.types.${type}.price`) }}
              <span v-if="type !== 'custom'" class="text-base font-normal text-neutral-400 dark:text-neutral-500 ml-0.5">&euro;</span>
            </p>
          </div>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="font-display text-2xl sm:text-3xl mb-10 text-center">{{ t('interview.title') }}</h2>
        <div class="aspect-video rounded-2xl overflow-hidden relative">
          <iframe
            v-if="showVideo"
            src="https://www.youtube.com/embed/DkTTzXJa1So?autoplay=1"
            title="Interview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          />
          <button v-else class="video-facade" @click="showVideo = true">
            <img src="/interview-thumbnail.png" alt="Interview thumbnail" class="w-full h-full object-cover" />
            <span class="video-play-btn">
              <Icon name="mdi:play" size="48" />
            </span>
          </button>
        </div>
      </section>

      <section class="mb-16">
        <h2 class="font-display text-2xl sm:text-3xl mb-10 text-center">{{ t('works.title') }}</h2>
        <p class="text-center text-neutral-400 dark:text-neutral-600">{{ t('works.soon') }}</p>
      </section>
    </main>

    <footer class="text-center py-8 text-sm text-neutral-400 dark:text-neutral-600">
      {{ new Date().getFullYear() }} Corentin Renard
    </footer>
  </div>
</template>

<style scoped>
.social-btn {
  position: relative;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.social-btn:hover {
  background-color: var(--color-neutral-100);
}

:where(.dark) .social-btn:hover {
  background-color: var(--color-neutral-800);
}

.social-tooltip {
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%) translateY(0.25rem);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.15s ease;
  background-color: var(--color-neutral-800);
  color: white;
}

:where(.dark) .social-tooltip {
  background-color: var(--color-neutral-200);
  color: var(--color-neutral-900);
}

.social-tooltip.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.workflow-card {
  flex: 1;
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-200);
  transition: border-color 0.15s;
}

.workflow-card:hover {
  border-color: var(--color-neutral-300);
}

:where(.dark) .workflow-card {
  background-color: var(--color-neutral-800);
  border-color: var(--color-neutral-700);
}

:where(.dark) .workflow-card:hover {
  border-color: var(--color-neutral-600);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: all 0.2s ease;
}

.icon-swap-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}

.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}

.video-facade {
  position: absolute;
  inset: 0;
  cursor: pointer;
  border: none;
  padding: 0;
}

.video-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  transition: background-color 0.15s, transform 0.15s;
}

.video-facade:hover .video-play-btn {
  background-color: rgba(0, 0, 0, 0.9);
  transform: translate(-50%, -50%) scale(1.1);
}
</style>
