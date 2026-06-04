<script setup lang="ts">
const { locale, setLocale } = useI18n()
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleLocale = () => {
  setLocale(locale.value === 'en' ? 'fr' : 'en')
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

    <slot />
  </div>
</template>
