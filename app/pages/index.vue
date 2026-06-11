<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { SITE_URL } from '#shared/utils/site'
import { workItems } from '#shared/utils/works'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const localizedUrl = useLocalizedUrl()

definePageMeta({
  scrollToTop: scrollToTopUnlessLocaleSwitch,
})

usePageSeo({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
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
let copyResetTimer: ReturnType<typeof setTimeout> | undefined
const handleSocialClick = async (social: typeof socials[number]) => {
  if (social.action !== 'copy' || !social.value) return
  await navigator.clipboard.writeText(social.value)
  copiedSocial.value = social.label
  clearTimeout(copyResetTimer)
  copyResetTimer = setTimeout(() => copiedSocial.value = null, 2000)
}

const hoveredSocial = ref<string | null>(null)
const isTooltipVisible = (label: string) => hoveredSocial.value === label || copiedSocial.value === label
const getTooltipText = (social: typeof socials[number]) => {
  if (copiedSocial.value === social.label) return t('social.copied')
  return social.label
}

const workflowSteps = [
  { key: 'design', icon: 'mdi:palette-outline' },
  { key: 'integration', icon: 'mdi:code-braces' },
  { key: 'maintenance', icon: 'mdi:wrench-outline' },
]

const pricingTypes = ['landing', 'showcase', 'ecommerce', 'custom'] as const
const pricedOfferTypes = ['landing', 'showcase', 'ecommerce'] as const
const faqItems = ['availability', 'location', 'stack', 'pricing'] as const

const showVideo = ref(false)
const currentYear = new Date().getFullYear()
const profileUrls = [
  'https://www.linkedin.com/in/corentin-renard-web/',
  'https://github.com/Aqu1tain',
  'https://www.behance.net/corentin_fox',
  'https://www.instagram.com/corentin_fox/',
]
const offerPrices = {
  landing: 900,
  showcase: 2500,
  ecommerce: 4500,
} as const

const heroEl = ref<HTMLElement | null>(null)
const localeSwitching = useState('locale-switching', () => false)
let heroCtx: gsap.Context | undefined

onMounted(async () => {
  if (localeSwitching.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.registerPlugin(SplitText)
  await document.fonts.ready
  if (!heroEl.value) return

  heroCtx = gsap.context(() => {
    const title = heroEl.value?.querySelector<HTMLElement>('.hero-title')
    if (!title) return
    const baseColor = getComputedStyle(title).color
    const accents = workItems.map((work) => work.accent)
    const split = SplitText.create(title, { type: 'chars', mask: 'chars' })
    split.chars.forEach((char, i) => gsap.set(char, { color: accents[i % accents.length] }))

    gsap.timeline({ onComplete: () => split.revert() })
      .from('.section-kicker', { autoAlpha: 0, y: 14, duration: 0.5, ease: 'power2.out' })
      .from(split.chars, { yPercent: 120, duration: 0.8, ease: 'power3.out', stagger: 0.035 }, 0.08)
      .to(split.chars, { color: baseColor, duration: 0.3, ease: 'power1.out', stagger: 0.035 }, 0.88)
      .from(['.hero-role', '.hero-intro', '.hero-actions'], { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.out', stagger: 0.12 }, 0.45)
  }, heroEl.value)
})

onUnmounted(() => heroCtx?.revert())

useHead(() => ({
  script: [
    {
      key: 'home-json-ld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: t('name'),
            inLanguage: locale.value === 'fr' ? 'fr-FR' : 'en-US',
          },
          {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: t('name'),
            url: SITE_URL,
            image: `${SITE_URL}/apple-touch-icon.png`,
            jobTitle: t('role'),
            knowsLanguage: ['fr-FR', 'en-US'],
            knowsAbout: ['UI/UX design', 'Nuxt', 'Vue', 'Figma', 'web development', 'maintenance'],
            sameAs: profileUrls,
          },
          {
            '@type': 'ProfessionalService',
            '@id': `${SITE_URL}/#service`,
            name: `${t('name')} - ${t('role')}`,
            url: localizedUrl('/'),
            image: `${SITE_URL}/og-image.png`,
            provider: { '@id': `${SITE_URL}/#person` },
            areaServed: { '@type': 'Country', name: 'France' },
            availableLanguage: ['French', 'English'],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: t('pricing.title'),
              itemListElement: pricedOfferTypes.map((type) => ({
                '@type': 'Offer',
                name: t(`pricing.types.${type}.title`),
                description: t(`pricing.types.${type}.sentence`),
                priceCurrency: 'EUR',
                price: offerPrices[type],
              })),
            },
          },
          {
            '@type': 'ProfilePage',
            '@id': `${localizedUrl('/')}#profile`,
            url: localizedUrl('/'),
            isPartOf: { '@id': `${SITE_URL}/#website` },
            mainEntity: { '@id': `${SITE_URL}/#person` },
          },
          {
            '@type': 'FAQPage',
            '@id': `${localizedUrl('/')}#faq`,
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: t(`faq.items.${item}.question`),
              acceptedAnswer: {
                '@type': 'Answer',
                text: t(`faq.items.${item}.answer`),
              },
            })),
          },
        ],
      }),
    },
  ],
}))
</script>

<template>
  <div>
    <main class="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
      <section class="hero-shell mb-28">
        <div ref="heroEl" class="hero-copy">
          <p class="section-kicker">{{ t('hero.kicker') }}</p>
          <h1 class="hero-title">{{ t('name') }}</h1>
          <p class="hero-role">{{ t('role') }}</p>
          <p class="hero-intro">{{ t('hero.intro') }}</p>

          <div class="hero-actions">
            <a href="#works" class="primary-link">
              <span>{{ t('hero.workCta') }}</span>
              <Icon name="mdi:arrow-down" size="18" />
            </a>
            <a
              :href="`/cv-${locale}.pdf`"
              target="_blank"
              class="secondary-link"
            >
              <Icon name="mdi:file-download-outline" size="20" />
              <span>{{ t('cv.download') }}</span>
            </a>
          </div>
        </div>

        <aside v-reveal="120" class="identity-panel" :aria-label="t('name')">
          <div class="portrait-wrap">
            <NuxtImg
              src="/apple-touch-icon.png"
              width="180"
              height="180"
              sizes="sm:88px md:320px"
              alt="Corentin Renard"
              class="portrait"
            />
          </div>
          <div>
            <p class="identity-label">{{ t('hero.availability') }}</p>
            <p class="identity-note">{{ t('avatarJoke') }}</p>
          </div>

          <div class="social-grid">
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
              @focus="hoveredSocial = social.label"
              @blur="hoveredSocial = null"
            >
              <Transition v-if="social.action === 'copy'" name="icon-swap" mode="out-in">
                <Icon v-if="copiedSocial === social.label" key="check" name="mdi:check" size="22" class="text-emerald-500" />
                <Icon v-else key="icon" :name="social.icon" size="22" />
              </Transition>
              <Icon v-else :name="social.icon" size="22" />
              <span
                class="social-tooltip"
                :class="{ visible: isTooltipVisible(social.label) }"
                :aria-live="social.action === 'copy' ? 'polite' : undefined"
              >
                {{ getTooltipText(social) }}
              </span>
            </component>
          </div>
        </aside>
      </section>

      <section id="process" class="section-block scroll-mt-28">
        <div v-reveal class="section-heading">
          <p class="section-kicker">01</p>
          <h2>{{ t('workflow.title') }}</h2>
        </div>
        <div class="workflow-grid">
          <div
            v-for="(step, i) in workflowSteps"
            :key="step.key"
            v-reveal="i * 90"
            class="workflow-card"
          >
            <div class="card-topline">
              <span><Icon :name="step.icon" size="20" /></span>
            </div>
            <h3>{{ t(`workflow.steps.${step.key}.title`) }}</h3>
            <p>{{ t(`workflow.steps.${step.key}.description`) }}</p>
          </div>
        </div>
      </section>

      <section class="section-block compact-block">
        <div v-reveal class="section-heading">
          <p class="section-kicker">02</p>
          <h2>{{ t('pricing.title') }}</h2>
          <span>{{ t('pricing.subtitle') }}</span>
        </div>
        <div class="pricing-grid">
          <div
            v-for="(type, i) in pricingTypes"
            :key="type"
            v-reveal="i * 90"
            class="pricing-card"
          >
            <p>{{ t(`pricing.types.${type}.title`) }}</p>
            <span v-if="type !== 'custom'" class="pricing-from">{{ t('pricing.from') }}</span>
            <strong>{{ t(`pricing.types.${type}.price`) }}</strong>
          </div>
        </div>
      </section>

      <section class="section-block">
        <div v-reveal class="section-heading">
          <p class="section-kicker">03</p>
          <h2>{{ t('faq.title') }}</h2>
        </div>
        <div class="faq-list">
          <details
            v-for="(item, i) in faqItems"
            :key="item"
            v-reveal="i * 60"
            class="faq-item"
          >
            <summary>
              <span>{{ t(`faq.items.${item}.question`) }}</span>
              <Icon name="mdi:plus" size="20" class="faq-icon" />
            </summary>
            <p>{{ t(`faq.items.${item}.answer`) }}</p>
          </details>
        </div>
      </section>

      <section class="section-block">
        <div v-reveal class="section-heading">
          <p class="section-kicker">04</p>
          <h2>{{ t('interview.title') }}</h2>
        </div>
        <div v-reveal="80" class="video-frame">
          <iframe
            v-if="showVideo"
            src="https://www.youtube.com/embed/DkTTzXJa1So?autoplay=1"
            title="Interview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="h-full w-full"
          />
          <button v-else class="video-facade" @click="showVideo = true">
            <img src="/interview-thumbnail.png" alt="Interview thumbnail" class="h-full w-full object-cover" />
            <span class="video-play-btn">
              <Icon name="mdi:youtube" size="58" />
            </span>
          </button>
        </div>
      </section>

      <section id="works" class="section-block scroll-mt-28">
        <div v-reveal class="section-heading works-heading">
          <div>
            <p class="section-kicker">05</p>
            <h2>{{ t('works.title') }}</h2>
          </div>
          <p>{{ t('works.subtitle') }}</p>
        </div>

        <div class="works-list">
          <NuxtLink
            v-for="(work, i) in workItems"
            :key="work.slug"
            v-reveal="i * 100"
            :to="localePath(`/works/${work.slug}`)"
            class="work-row"
            :style="{
              '--work-accent': work.accent,
            }"
          >
            <div class="work-row-top">
              <p>{{ work.year }} / {{ t(`works.types.${work.type}`) }}</p>
              <Icon name="mdi:arrow-top-right" size="22" class="work-arrow" />
            </div>
            <h3 class="work-title">
              <span class="work-title-track">
                <span class="work-title-segment">{{ t(`works.items.${work.slug}.title`) }}</span>
                <span class="work-title-segment" aria-hidden="true">{{ t(`works.items.${work.slug}.title`) }}</span>
              </span>
            </h3>
            <div class="work-row-bottom">
              <p class="work-preview">{{ t(`works.items.${work.slug}.preview`) }}</p>
              <div class="work-tags">
                <span v-for="tag in work.stack" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>

    <footer class="footer">
      <span>{{ currentYear }} Corentin Renard</span>
      <a href="mailto:contact@corentinrenard.com">contact@corentinrenard.com</a>
    </footer>
  </div>
</template>

<style scoped>
.hero-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  min-height: calc(100vh - 8rem);
  align-items: center;
}

.hero-copy {
  max-width: 48rem;
}

.section-kicker {
  margin-bottom: 1rem;
  color: var(--color-neutral-500);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-title {
  font-family: var(--font-display), serif;
  font-size: 4rem;
  line-height: 0.95;
  margin-bottom: 1rem;
}

.hero-role {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-neutral-700);
}

.hero-intro {
  max-width: 38rem;
  margin-top: 1rem;
  color: var(--color-neutral-500);
  font-size: 1.05rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.primary-link,
.secondary-link {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: 1px solid var(--color-neutral-900);
  border-radius: 999px;
  padding: 0.8rem 1.1rem;
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.primary-link {
  background: var(--color-neutral-900);
  color: white;
}

.secondary-link {
  border-color: var(--color-neutral-200);
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-neutral-900);
}

.secondary-link:hover {
  border-color: var(--color-neutral-900);
  background: white;
}

.identity-panel {
  position: relative;
  display: grid;
  gap: 1.5rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 1.5rem;
  padding: 1rem;
  background:
    linear-gradient(var(--color-neutral-100) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-neutral-100) 1px, transparent 1px),
    var(--color-neutral-50);
  background-size: 28px 28px;
  overflow: visible;
}

.portrait-wrap {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 1rem;
  background: var(--color-neutral-900);
}

.portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.08);
}

.identity-label {
  margin-bottom: 0.4rem;
  font-weight: 800;
}

.identity-note {
  color: var(--color-neutral-500);
  line-height: 1.6;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.5rem;
}

.social-btn {
  position: relative;
  display: flex;
  aspect-ratio: 1 / 1;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-neutral-200);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  border-color: var(--color-neutral-900);
  background-color: white;
}

.social-tooltip {
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%) translateY(0.25rem);
  z-index: 2;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  background-color: var(--color-neutral-900);
  color: white;
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.social-tooltip.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.section-block {
  margin-bottom: 7rem;
}

.compact-block {
  margin-bottom: 6rem;
}

.section-heading {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.section-heading h2 {
  font-family: var(--font-display), serif;
  font-size: 2.7rem;
  line-height: 1;
}

.section-heading span,
.works-heading > p {
  max-width: 30rem;
  color: var(--color-neutral-500);
  line-height: 1.7;
}

.workflow-grid,
.pricing-grid {
  display: grid;
  gap: 1rem;
}

.workflow-card,
.pricing-card {
  border: 1px solid var(--color-neutral-200);
  border-radius: 1rem;
  background: rgba(250, 250, 250, 0.9);
}

.workflow-card {
  min-height: 15rem;
  padding: 1.25rem;
  transition: border-color 0.2s ease;
}

.workflow-card:hover {
  border-color: var(--color-neutral-900);
}

.card-topline {
  margin-bottom: 2.5rem;
}

.card-topline > span {
  display: inline-flex;
  width: 2.35rem;
  height: 2.35rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--color-neutral-900);
  color: white;
}

.workflow-card h3 {
  margin-bottom: 0.65rem;
  font-size: 1.2rem;
  font-weight: 800;
}

.workflow-card p {
  color: var(--color-neutral-600);
  line-height: 1.7;
}

.pricing-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
}

.pricing-card p {
  margin-bottom: auto;
  padding-bottom: 2.25rem;
  color: var(--color-neutral-500);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.pricing-from {
  color: var(--color-neutral-500);
  font-size: 0.9rem;
}

.pricing-card strong {
  display: block;
  margin-top: 0.2rem;
  font-family: var(--font-display), serif;
  font-size: 2.4rem;
  font-weight: 400;
  line-height: 1;
}

.faq-list {
  display: grid;
  border-top: 1px solid var(--color-neutral-200);
}

.faq-item {
  border-bottom: 1px solid var(--color-neutral-200);
}

.faq-item summary {
  display: flex;
  min-height: 4.25rem;
  cursor: pointer;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--color-neutral-900);
  font-weight: 800;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item::details-content {
  opacity: 0;
  block-size: 0;
  overflow: clip;
  transition: block-size 0.3s ease, opacity 0.3s ease, content-visibility 0.3s allow-discrete;
}

.faq-item[open]::details-content {
  opacity: 1;
  block-size: auto;
}

.faq-icon {
  flex: 0 0 auto;
  color: var(--color-neutral-500);
  transition: transform 0.2s ease, color 0.2s ease;
}

.faq-item[open] .faq-icon {
  color: var(--color-neutral-900);
  transform: rotate(45deg);
}

.faq-item p {
  max-width: 44rem;
  padding: 0 2.75rem 1.35rem 0;
  color: var(--color-neutral-600);
  line-height: 1.75;
}

.video-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--color-neutral-200);
  border-radius: 1rem;
  background: var(--color-neutral-100);
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
  color: #f00;
  transition: transform 0.2s ease;
}

.video-facade:hover .video-play-btn {
  transform: translate(-50%, -50%) scale(1.07);
}

.works-heading {
  align-items: end;
}

.works-list {
  display: grid;
  border-top: 1px solid var(--color-neutral-200);
}

.work-row {
  --accent: var(--work-accent);
  display: block;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-neutral-200);
  overflow: hidden;
  color: inherit;
  transition: color 0.2s ease;
}

:where(.dark) .work-row {
  --accent: color-mix(in srgb, var(--work-accent) 60%, white);
}

.work-row:hover {
  color: var(--accent);
}

.work-row-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-neutral-500);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.work-row-top p {
  min-width: 0;
}

.work-arrow {
  margin-left: auto;
  opacity: 0.45;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.work-row:hover .work-arrow {
  transform: translate(0.2rem, -0.2rem);
  opacity: 1;
}

.work-title {
  margin: 0.55rem 0 0.65rem;
  font-family: var(--font-display), serif;
  font-size: clamp(3.5rem, 11vw, 8rem);
  line-height: 0.9;
  white-space: nowrap;
}

.work-title-track {
  display: inline-flex;
  min-width: max-content;
}

.work-title-segment {
  display: inline-block;
  padding-right: 3rem;
}

.work-title-segment + .work-title-segment {
  visibility: hidden;
}

.work-row-bottom {
  display: grid;
  gap: 0.85rem;
}

.work-preview {
  max-width: 36rem;
  color: var(--color-neutral-600);
  line-height: 1.7;
}

.work-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: end;
}

.work-tags span {
  border: 1px solid var(--color-neutral-200);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  color: var(--color-neutral-600);
  font-size: 0.75rem;
  font-weight: 700;
}

@media (hover: hover) and (pointer: fine) {
  .work-row:hover .work-title-track {
    animation: title-marquee 8s linear infinite;
  }

  .work-row:hover .work-title-segment + .work-title-segment {
    visibility: visible;
  }
}

@keyframes title-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.25rem;
  color: var(--color-neutral-500);
  font-size: 0.875rem;
}

.footer a:hover {
  color: var(--color-neutral-900);
}

:where(.dark) .hero-role,
:where(.dark) .workflow-card p,
:where(.dark) .faq-item p,
:where(.dark) .work-preview {
  color: var(--color-neutral-300);
}

:where(.dark) .hero-intro,
:where(.dark) .identity-note,
:where(.dark) .section-heading span,
:where(.dark) .works-heading > p,
:where(.dark) .pricing-card p,
:where(.dark) .pricing-from,
:where(.dark) .work-row-top,
:where(.dark) .work-tags span,
:where(.dark) .footer {
  color: var(--color-neutral-400);
}

:where(.dark) .secondary-link,
:where(.dark) .identity-panel,
:where(.dark) .workflow-card,
:where(.dark) .pricing-card {
  border-color: var(--color-neutral-800);
  background-color: rgba(38, 38, 38, 0.76);
}

:where(.dark) .identity-panel {
  background:
    linear-gradient(var(--color-neutral-800) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-neutral-800) 1px, transparent 1px),
    var(--color-neutral-900);
  background-size: 28px 28px;
}

:where(.dark) .secondary-link,
:where(.dark) .social-btn {
  background: rgba(38, 38, 38, 0.78);
  color: var(--color-neutral-100);
}

:where(.dark) .secondary-link:hover {
  border-color: var(--color-neutral-100);
  background: var(--color-neutral-800);
}

:where(.dark) .social-btn {
  border-color: var(--color-neutral-800);
}

:where(.dark) .social-btn:hover,
:where(.dark) .workflow-card:hover {
  border-color: var(--color-neutral-100);
}

:where(.dark) .social-btn:hover {
  background-color: var(--color-neutral-700);
}

:where(.dark) .card-topline > span {
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
}

:where(.dark) .social-tooltip {
  background-color: var(--color-neutral-100);
  color: var(--color-neutral-900);
}

:where(.dark) .video-frame {
  border-color: var(--color-neutral-800);
  background: var(--color-neutral-800);
}

:where(.dark) .works-list,
:where(.dark) .work-row,
:where(.dark) .faq-list,
:where(.dark) .faq-item {
  border-color: var(--color-neutral-800);
}

:where(.dark) .faq-item summary {
  color: var(--color-neutral-100);
}

:where(.dark) .faq-item[open] .faq-icon {
  color: var(--color-neutral-100);
}

:where(.dark) .work-tags span {
  border-color: var(--color-neutral-700);
}

:where(.dark) .footer a:hover {
  color: var(--color-neutral-100);
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

@media (min-width: 640px) {
  .hero-title {
    font-size: 5.5rem;
  }

  .section-heading h2 {
    font-size: 3.4rem;
  }

  .pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .hero-shell {
    grid-template-columns: minmax(0, 1.3fr) minmax(18rem, 0.7fr);
  }

  .workflow-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .works-heading {
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.42fr);
  }
}

@media (max-width: 639px) {
  .hero-shell {
    min-height: auto;
    align-items: start;
  }

  .hero-title {
    font-size: 3.25rem;
  }

  .hero-intro {
    font-size: 1rem;
    line-height: 1.65;
  }

  .hero-actions a {
    width: 100%;
  }

  .identity-panel {
    grid-template-columns: 5.5rem minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
  }

  .portrait-wrap {
    border-radius: 0.8rem;
  }

  .social-grid {
    grid-column: 1 / -1;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.35rem;
  }

  .social-btn {
    border-radius: 0.65rem;
  }

  .section-heading h2 {
    font-size: 2.4rem;
  }

  .work-title {
    font-size: clamp(3.2rem, 17vw, 5.2rem);
    line-height: 0.95;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .work-title-track {
    display: block;
    min-width: 0;
  }

  .work-title-segment {
    padding-right: 0;
  }

  .work-title-segment + .work-title-segment {
    display: none;
  }

  .work-row {
    padding: 1.15rem 0;
  }

  .work-row-top {
    gap: 0.5rem;
    letter-spacing: 0.08em;
  }

  .work-row-bottom {
    gap: 0.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .primary-link,
  .secondary-link,
  .social-btn,
  .workflow-card,
  .work-arrow,
  .video-play-btn {
    transition: none;
  }

  .social-btn:hover,
  .work-row:hover .work-arrow {
    transform: none;
  }

  .faq-item::details-content {
    transition: none;
  }

  .work-row:hover .work-title-track {
    animation: none;
  }

  .icon-swap-enter-active,
  .icon-swap-leave-active {
    transition: none;
  }
}
</style>
