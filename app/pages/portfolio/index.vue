<template>
    <div class="overflow-hidden w-screen h-screen relative">
        <UniversalHeader />

        <div
              ref="carousel"
              class="carousel w-full h-full flex overflow-x-scroll scroll-smooth snap-x snap-mandatory"
        >
            <div
                  v-for="(slide, i) in slides"
                  :key="i"
                  class="carousel-item snap-start w-screen h-screen flex-shrink-0 relative"
            >
                <NuxtImg
                      :src="slide.imageSrc"
                      class="object-cover w-full h-full"
                      :alt="slide.alt"
                />
                <div
                      v-if="slide.darken"
                      class="absolute inset-0 bg-black"
                      :style="{ opacity: slide.darkenValue ?? 0.5 }"
                />
            </div>
        </div>

        <div class="fixed top-1/2 -translate-y-1/2 right-11 flex flex-col gap-2 py-2">
            <button
                  v-for="(slide, i) in slides"
                  :key="i"
                  @click="goTo(i)"
                  :class="[
          'text-lg text-right cursor-pointer',
          activeIndex === i ? 'text-base-100' : 'text-base-100/30'
        ]"
            >
                {{ slide.title }}
            </button>
        </div>

        <h1 class="fixed bottom-11 left-11 text-white text-7xl">
            {{ currentSlide.title }}
        </h1>
        <div class="fixed bottom-11 right-11 flex gap-2">
            <NuxtLink
                  v-if="currentSlide.siteUrl"
                  :to="currentSlide.siteUrl"
                  external
            >
                <GlassButton>
                    Visiter le site <Icon name="lucide:external-link" />
                </GlassButton>
            </NuxtLink>
            <NuxtLink
                  v-if="currentSlide.projectUrl"
                  :to="currentSlide.projectUrl"
            >
                <GlassButton>Voir le projet</GlassButton>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

interface Slide {
    title: string
    imageSrc: string
    alt: string
    siteUrl?: string
    projectUrl?: string
    darken?: boolean
    darkenValue?: number
}

const slides: Slide[] = [
    {
        title: 'Les chemins du pain',
        imageSrc: 'https://lescheminsdupain.com/img/BakingBaguette.webp',
        alt: 'Image de pain en train de cuire',
        siteUrl: 'https://www.lescheminsdupain.com',
        projectUrl: '/projets/les-chemins-du-pain',
        darken: false
    },
    {
        title: 'AFC Landes',
        imageSrc: 'https://afc40landes.fr/src/utils/img/slider.jpg',
        alt: 'Une famille au bord de la plage',
        siteUrl: 'https://www.afc40landes.fr',
        projectUrl: '/projets/afc-landes',
        darken: true,
        darkenValue: 0.2
    }
]

const carousel = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const currentSlide = computed(() => slides[activeIndex.value]!)

function updateActive() {
    if (!carousel.value) return
    const width = carousel.value.clientWidth
    activeIndex.value = Math.round(carousel.value.scrollLeft / width)
}

function goTo(i: number) {
    if (!carousel.value) return
    const x = carousel.value.clientWidth * i
    gsap.to(carousel.value, {
        scrollTo: { x },
        duration: 0.5,
        ease: 'power2.out'
    })
}

onMounted(() => {
    updateActive()
    carousel.value?.addEventListener('scroll', updateActive, { passive: true })
})

onUnmounted(() => {
    carousel.value?.removeEventListener('scroll', updateActive)
})

definePageMeta({
    prerender: true
})
</script>

<style>
.carousel::-webkit-scrollbar {
    display: none;
}
.carousel {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
