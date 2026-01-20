<script setup lang="ts">
const { t, locale, setLocale } = useI18n()
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleLocale = () => {
  setLocale(locale.value === 'en' ? 'fr' : 'en')
}

const socials = [
  { icon: 'mdi:instagram', href: '#', label: 'Instagram' },
  { icon: 'mdi:github', href: '#', label: 'GitHub' },
  { icon: 'mdi:discord', href: '#', label: 'Discord' },
  { icon: 'mdi:email', href: 'mailto:contact@example.com', label: 'Email' },
  { icon: 'mdi:linkedin', href: '#', label: 'LinkedIn' },
  { icon: 'mdi:behance', href: '#', label: 'Behance' },
]

const workflowSteps = ['design', 'integration', 'maintenance'] as const
const pricingTypes = ['landing', 'showcase', 'ecommerce', 'custom'] as const
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 font-sans transition-colors">
    <header class="fixed top-0 right-0 p-6 flex gap-4 z-50">
      <button
        class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        @click="toggleLocale"
      >
        {{ locale === 'en' ? 'FR' : 'EN' }}
      </button>
      <button
        class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        @click="toggleTheme"
      >
        <Icon
          :name="colorMode.value === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'"
          class="w-5 h-5"
        />
      </button>
    </header>

    <main class="max-w-2xl mx-auto px-6 py-24">
      <section class="text-center mb-20">
        <img
          src="https://www.zoologiste.com/images/main/capybara-ia.jpg"
          alt="Corentin Renard"
          class="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
        />
        <h1 class="font-display text-4xl mb-2">{{ t('name') }}</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-4">{{ t('role') }}</p>
        <p class="text-sm text-neutral-500 dark:text-neutral-500 italic">{{ t('avatarJoke') }}</p>

        <div class="flex justify-center gap-4 mt-8">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            class="p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Icon :name="social.icon" class="w-6 h-6" />
          </a>
        </div>
      </section>

      <section class="mb-20">
        <h2 class="font-display text-2xl mb-8 text-center">{{ t('workflow.title') }}</h2>
        <div class="grid gap-6">
          <div
            v-for="(step, index) in workflowSteps"
            :key="step"
            class="flex gap-4 items-start"
          >
            <span class="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center text-sm font-medium shrink-0">
              {{ index + 1 }}
            </span>
            <div>
              <h3 class="font-medium mb-1">{{ t(`workflow.steps.${step}.title`) }}</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ t(`workflow.steps.${step}.description`) }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-20">
        <h2 class="font-display text-2xl mb-2 text-center">{{ t('pricing.title') }}</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-500 text-center mb-8">{{ t('pricing.subtitle') }}</p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div
            v-for="type in pricingTypes"
            :key="type"
            class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800"
          >
            <h3 class="font-medium mb-2">{{ t(`pricing.types.${type}.title`) }}</h3>
            <p class="text-2xl font-display">{{ t(`pricing.types.${type}.price`) }}<span v-if="type !== 'custom'" class="text-sm font-sans text-neutral-500">&euro;</span></p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-display text-2xl mb-8 text-center">{{ t('works.title') }}</h2>
        <p class="text-center text-neutral-500 dark:text-neutral-500">{{ t('works.soon') }}</p>
      </section>
    </main>
  </div>
</template>
