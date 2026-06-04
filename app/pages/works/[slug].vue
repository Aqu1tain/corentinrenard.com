<script setup lang="ts">
import { findWorkBySlug, workTypeMeta } from '~/utils/works'

const route = useRoute()
const { t } = useI18n()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const work = findWorkBySlug(slug ?? '')

if (!work) {
  throw createError({ status: 404, statusText: 'Page Not Found' })
}

usePageSeo({
  title: () => t(`works.items.${work.slug}.title`),
  description: () => t(`works.items.${work.slug}.description`),
  type: 'article',
  url: () => `https://corentinrenard.com/works/${work.slug}`,
})

const sections = ['context', 'approach', 'result'] as const
</script>

<template>
  <main class="max-w-4xl mx-auto px-6 py-16 sm:py-24">
    <NuxtLink to="/#works" class="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-10">
      <Icon name="mdi:arrow-left" size="18" />
      {{ t('works.detail.back') }}
    </NuxtLink>

    <article>
      <header class="mb-10">
        <NuxtImg
          v-if="work.image"
          :src="work.image"
          width="720"
          height="320"
          fit="cover"
          class="w-full rounded-xl mb-6"
          :alt="t(`works.items.${work.slug}.title`)"
        />
        <span class="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {{ t(`works.types.${work.type}`) }}
        </span>
        <h1
          class="font-display text-4xl sm:text-5xl mt-2 mb-4"
          :style="work.font ? { fontFamily: work.font } : undefined"
        >{{ t(`works.items.${work.slug}.title`) }}</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {{ t(`works.items.${work.slug}.description`) }}
        </p>
      </header>

      <div class="space-y-4">
        <section v-for="(key, index) in sections" :key="key" class="detail-card">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <div>
            <h2>{{ t(`works.detail.${key}`) }}</h2>
            <p>{{ t(`works.items.${work.slug}.${key}`) }}</p>
          </div>
        </section>
      </div>
    </article>
  </main>
</template>

<style scoped>
.detail-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-200);
}

.detail-card span {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-neutral-400);
}

.detail-card h2 {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.detail-card p {
  color: var(--color-neutral-600);
  line-height: 1.7;
}

:where(.dark) .detail-card {
  background-color: var(--color-neutral-800);
  border-color: var(--color-neutral-700);
}

:where(.dark) .detail-card p {
  color: var(--color-neutral-400);
}
</style>
