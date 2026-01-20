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
  { icon: 'mdi:instagram', href: 'https://www.instagram.com/corentin_fox/', label: 'Instagram' },
  { icon: 'mdi:github', href: 'https://github.com/Aqu1tain', label: 'GitHub' },
  { icon: 'mdi:email', href: 'mailto:contact@corentinrenard.com', label: 'Email' },
  { icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/corentin-renard-web/', label: 'LinkedIn' },
  { icon: 'mdi:behance', href: 'https://www.behance.net/corentin_fox', label: 'Behance' },
]

const discordCopied = ref(false)
const copyDiscord = async () => {
  await navigator.clipboard.writeText('Akitain')
  discordCopied.value = true
  setTimeout(() => discordCopied.value = false, 2000)
}

const workflowSteps = [
  { key: 'design', icon: 'mdi:palette-outline' },
  { key: 'integration', icon: 'mdi:code-braces' },
  { key: 'maintenance', icon: 'mdi:wrench-outline' },
] as const
const pricingTypes = ['landing', 'showcase', 'ecommerce', 'custom'] as const
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

    <main class="max-w-2xl mx-auto px-6 py-24 sm:py-32">
      <section class="text-center mb-24">
        <img
          src="https://www.zoologiste.com/images/main/capybara-ia.jpg"
          alt="Corentin Renard"
          class="w-36 h-36 rounded-full mx-auto mb-8 object-cover ring-4 ring-neutral-100 dark:ring-neutral-700"
        />
        <h1 class="font-display text-4xl sm:text-5xl mb-3">{{ t('name') }}</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-3">{{ t('role') }}</p>
        <p class="text-sm text-neutral-400 dark:text-neutral-600 italic">{{ t('avatarJoke') }}</p>

        <div class="flex justify-center gap-2 mt-10">
          <a
            v-for="social in socials.slice(0, 2)"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            class="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Icon :name="social.icon" size="24" />
          </a>
          <button
            aria-label="Discord"
            class="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative group"
            @click="copyDiscord"
          >
            <Transition name="icon-swap" mode="out-in">
              <Icon v-if="discordCopied" key="check" name="mdi:check" size="24" class="text-green-500" />
              <Icon v-else key="discord" name="mdi:discord" size="24" />
            </Transition>
            <Transition name="tooltip">
              <span
                v-if="discordCopied"
                class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 px-2 py-1 rounded whitespace-nowrap"
              >
                Copied!
              </span>
            </Transition>
          </button>
          <a
            v-for="social in socials.slice(2)"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            class="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Icon :name="social.icon" size="24" />
          </a>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="font-display text-2xl sm:text-3xl mb-10 text-center">{{ t('workflow.title') }}</h2>
        <div class="grid sm:grid-cols-3 gap-6">
          <div
            v-for="(step, index) in workflowSteps"
            :key="step.key"
            class="relative p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 group hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
          >
            <div class="flex items-center gap-3 mb-4">
              <span class="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center text-sm font-semibold">
                {{ index + 1 }}
              </span>
              <Icon :name="step.icon" size="24" class="text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 class="font-semibold mb-2">{{ t(`workflow.steps.${step.key}.title`) }}</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{{ t(`workflow.steps.${step.key}.description`) }}</p>
            <Icon
              v-if="index < workflowSteps.length - 1"
              name="mdi:chevron-right"
              size="20"
              class="hidden sm:block absolute -right-3.5 top-1/2 -translate-y-1/2 text-neutral-300 dark:text-neutral-600"
            />
          </div>
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
            <p class="text-2xl font-display">{{ t(`pricing.types.${type}.price`) }}<span v-if="type !== 'custom'" class="text-base font-sans text-neutral-400 dark:text-neutral-500 ml-0.5">&euro;</span></p>
          </div>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="font-display text-2xl sm:text-3xl mb-10 text-center">{{ t('interview.title') }}</h2>
        <div class="aspect-video rounded-2xl overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/DkTTzXJa1So"
            title="Interview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          />
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

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, 4px);
}
</style>
