<script setup lang="ts">
import { SITE_URL } from '#shared/utils/site'
import { findWorkBySlug, workItems } from '#shared/utils/works'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const localizedUrl = useLocalizedUrl()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const work = findWorkBySlug(slug ?? '')

if (!work) {
  throw createError({ status: 404, statusText: 'Page Not Found' })
}

const currentIndex = workItems.findIndex(item => item.slug === work.slug)
const nextWork = workItems[(currentIndex + 1) % workItems.length]
const sections = ['context', 'approach', 'result'] as const

usePageSeo({
  title: () => t(`works.items.${work.slug}.title`),
  description: () => t(`works.items.${work.slug}.description`),
  type: 'article',
  path: () => `/works/${work.slug}`,
  robots: () => work.published ? 'index, follow' : 'noindex, follow',
})

const localizedWorkUrl = () => localizedUrl(`/works/${work.slug}`)

useHead(() => ({
  script: [
    {
      key: 'work-json-ld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CreativeWork',
            '@id': `${localizedWorkUrl()}#creative-work`,
            url: localizedWorkUrl(),
            headline: t(`works.items.${work.slug}.title`),
            abstract: t(`works.items.${work.slug}.description`),
            inLanguage: locale.value === 'fr' ? 'fr-FR' : 'en-US',
            author: { '@id': `${SITE_URL}/#person` },
            creator: { '@id': `${SITE_URL}/#person` },
            keywords: work.stack,
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${localizedWorkUrl()}#breadcrumb`,
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: t('name'),
                item: localizedUrl('/'),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: t('works.title'),
                item: `${localizedUrl('/')}#works`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: t(`works.items.${work.slug}.title`),
                item: localizedWorkUrl(),
              },
            ],
          },
        ],
      }),
    },
  ],
}))
</script>

<template>
  <main
    class="case-page"
    :style="{ '--work-accent': work.accent }"
  >
    <NuxtLink :to="localePath({ path: '/', hash: '#works' })" class="back-link">
      <Icon name="mdi:arrow-left" size="18" />
      {{ t('works.detail.back') }}
    </NuxtLink>

    <article class="case-article">
      <header class="case-hero">
        <div class="case-hero-main">
          <p class="case-kicker">{{ work.year }} / {{ t(`works.types.${work.type}`) }}</p>
          <h1>
            {{ t(`works.items.${work.slug}.title`) }}
          </h1>
          <p class="case-lede">{{ t(`works.items.${work.slug}.description`) }}</p>
        </div>

        <dl class="case-meta">
          <div>
            <dt>{{ t('works.detail.year') }}</dt>
            <dd>{{ work.year }}</dd>
          </div>
          <div>
            <dt>{{ t('works.detail.type') }}</dt>
            <dd>{{ t(`works.types.${work.type}`) }}</dd>
          </div>
          <div>
            <dt>{{ t('works.detail.scope') }}</dt>
            <dd>{{ work.stack.join(', ') }}</dd>
          </div>
        </dl>
      </header>

      <figure class="case-media">
        <NuxtImg
          v-if="work.image"
          :src="work.image"
          width="1200"
          height="720"
          fit="cover"
          :alt="t(`works.items.${work.slug}.title`)"
        />
        <div v-else class="case-media-placeholder">
          <span>{{ t(`works.types.${work.type}`) }}</span>
          <Icon name="mdi:arrow-top-right" size="34" />
        </div>
      </figure>

      <div class="case-content">
        <aside class="case-rail">
          <p>{{ t('works.detail.articleLabel') }}</p>
          <nav aria-label="Case study sections">
            <a
              v-for="section in sections"
              :key="section"
              :href="`#${section}`"
            >
              {{ t(`works.detail.${section}`) }}
            </a>
          </nav>
        </aside>

        <div class="case-prose">
          <section
            v-for="(key, index) in sections"
            :id="key"
            :key="key"
            class="case-section"
          >
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <h2>{{ t(`works.detail.${key}`) }}</h2>
            <p>{{ t(`works.items.${work.slug}.${key}`) }}</p>
          </section>
        </div>
      </div>

      <NuxtLink
        v-if="nextWork"
        class="next-case"
        :to="localePath(`/works/${nextWork.slug}`)"
      >
        <span>{{ t('works.detail.next') }}</span>
        <strong>{{ t(`works.items.${nextWork.slug}.title`) }}</strong>
        <Icon name="mdi:arrow-right" size="22" />
      </NuxtLink>
    </article>
  </main>
</template>

<style scoped>
.case-page {
  width: min(calc(100% - 2.5rem), 68rem);
  margin: 0 auto;
  padding: 7rem 0 4rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  color: var(--color-neutral-500);
  font-size: 0.9rem;
  font-weight: 700;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-neutral-900);
}

.case-article {
  display: grid;
  gap: 2.25rem;
}

.case-hero {
  display: grid;
  gap: 2rem;
}

.case-kicker {
  margin-bottom: 1.25rem;
  color: var(--work-accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.case-hero h1 {
  max-width: 58rem;
  font-family: var(--font-display), serif;
  font-size: clamp(4rem, 12vw, 9rem);
  line-height: 0.86;
  overflow-wrap: anywhere;
}

.case-lede {
  max-width: 42rem;
  margin-top: 1.5rem;
  color: var(--color-neutral-600);
  font-size: 1.25rem;
  line-height: 1.75;
}

.case-meta {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--color-neutral-200);
}

.case-meta div {
  display: grid;
  grid-template-columns: minmax(5.5rem, 0.35fr) minmax(0, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-neutral-200);
}

.case-meta dt {
  color: var(--color-neutral-500);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.case-meta dd {
  color: var(--color-neutral-700);
  font-weight: 700;
}

.case-media {
  aspect-ratio: 16 / 9;
  min-height: 20rem;
  overflow: hidden;
  border: 1px solid var(--color-neutral-200);
  border-radius: 1rem;
  background: var(--color-neutral-50);
}

.case-media img,
.case-media-placeholder {
  width: 100%;
  height: 100%;
}

.case-media img {
  object-fit: cover;
}

.case-media-placeholder {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--work-accent) 16%, white), transparent 42%),
    linear-gradient(var(--color-neutral-200) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-neutral-200) 1px, transparent 1px),
    color-mix(in srgb, var(--work-accent) 10%, white);
  background-size: auto, 24px 24px, 24px 24px, auto;
  color: var(--work-accent);
}

.case-media-placeholder span,
.case-media-placeholder svg {
  border: 1px solid color-mix(in srgb, var(--work-accent) 24%, transparent);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
}

.case-media-placeholder span {
  padding: 0.45rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.case-media-placeholder svg {
  box-sizing: content-box;
  padding: 0.55rem;
}

.case-content {
  display: grid;
  gap: 2rem;
}

.case-rail {
  color: var(--color-neutral-500);
  font-size: 0.85rem;
}

.case-rail p {
  margin-bottom: 1rem;
  color: var(--color-neutral-900);
  font-weight: 800;
}

.case-rail nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.case-rail a {
  border: 1px solid var(--color-neutral-200);
  border-radius: 999px;
  padding: 0.4rem 0.7rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.case-rail a:hover {
  border-color: var(--work-accent);
  color: var(--work-accent);
}

.case-prose {
  display: grid;
  gap: 3rem;
  max-width: 48rem;
}

.case-section {
  scroll-margin-top: 7rem;
}

.case-section > span {
  display: block;
  margin-bottom: 0.85rem;
  color: var(--work-accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.case-section h2 {
  margin-bottom: 1rem;
  font-family: var(--font-display), serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 0.95;
}

.case-section p {
  color: var(--color-neutral-600);
  font-size: 1.12rem;
  line-height: 1.9;
}

.next-case {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: end;
  margin-top: 2rem;
  border-top: 1px solid var(--color-neutral-200);
  padding-top: 1.25rem;
  transition: color 0.2s ease;
}

.next-case:hover {
  color: var(--work-accent);
}

.next-case span {
  grid-column: 1 / -1;
  color: var(--color-neutral-500);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.next-case strong {
  min-width: 0;
  font-family: var(--font-display), serif;
  font-size: clamp(2.6rem, 7vw, 5rem);
  line-height: 0.95;
}

.next-case svg {
  margin-bottom: 0.35rem;
}

:where(.dark) .back-link:hover,
:where(.dark) .case-rail p {
  color: var(--color-neutral-100);
}

:where(.dark) .case-lede,
:where(.dark) .case-meta dd,
:where(.dark) .case-section p {
  color: var(--color-neutral-400);
}

:where(.dark) .case-meta,
:where(.dark) .case-meta div,
:where(.dark) .case-media,
:where(.dark) .case-rail a,
:where(.dark) .next-case {
  border-color: var(--color-neutral-800);
}

:where(.dark) .case-media {
  background: var(--color-neutral-900);
}

:where(.dark) .case-media-placeholder {
  background:
    linear-gradient(var(--color-neutral-800) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-neutral-800) 1px, transparent 1px),
    color-mix(in srgb, var(--work-accent) 18%, var(--color-neutral-900));
  background-size: 24px 24px, 24px 24px, auto;
}

@media (min-width: 860px) {
  .case-hero {
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.34fr);
    align-items: end;
  }

  .case-meta {
    margin-bottom: 0.35rem;
  }

  .case-content {
    grid-template-columns: minmax(10rem, 0.24fr) minmax(0, 0.76fr);
    align-items: start;
  }

  .case-rail {
    position: sticky;
    top: 6.5rem;
  }

  .case-rail nav {
    display: grid;
  }
}

@media (max-width: 639px) {
  .case-page {
    width: min(calc(100% - 1.5rem), 72rem);
    padding: 6rem 0 3rem;
  }

  .back-link {
    margin-bottom: 1.25rem;
  }

  .case-article {
    gap: 1.5rem;
  }

  .case-hero {
    gap: 1.5rem;
  }

  .case-hero h1 {
    font-size: clamp(3rem, 17vw, 4.5rem);
  }

  .case-lede,
  .case-section p {
    font-size: 1rem;
    line-height: 1.72;
  }

  .case-meta div {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }

  .case-media {
    min-height: 14rem;
  }

  .case-prose {
    gap: 2.25rem;
  }
}
</style>
