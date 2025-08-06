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

        <div class="fixed bottom-14 right-14 flex flex-col gap-2 py-2">
            <button
                  v-for="(slide, i) in slides"
                  :key="i"
                  @click="goTo(i)"
                  :class="[
          'text-lg text-right cursor-pointer',
          activeIndex === i ? 'text-base-100' : 'text-base-100/50'
        ]"
            >
                {{ slide.title }}
            </button>
        </div>

        <div class="fixed w-1/2 bottom-14 left-14 text-white gap-5 flex flex-col">
            <h1
                  ref="titleRef"
                  class="text-7xl whitespace-pre"
            ></h1>
            <p class="w-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vestibulum convallis ante, sit amet fringilla dolor dictum in. Nulla facilisi. Proin sodales ullamcorper dignissim. Sed pharetra et lectus ut auctor. Duis nec neque ullamcorper, placerat urna vel, sagittis ipsum. Pellentesque volutpat massa quis justo elementum, vitae feugiat erat congue. Morbi quis porta ex.
            </p>

            <div class="flex gap-2">
                <NuxtLink
                      v-if="currentSlide?.siteUrl"
                      :to="currentSlide.siteUrl"
                      external
                >
                    <GlassButton>
                        Visiter le site <Icon name="lucide:external-link" />
                    </GlassButton>
                </NuxtLink>
                <NuxtLink
                      v-if="currentSlide?.projectUrl"
                      :to="currentSlide.projectUrl"
                >
                    <GlassButton>Voir le projet</GlassButton>
                </NuxtLink>
            </div>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrollToPlugin, ScrambleTextPlugin)

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
    },
    {
        title: 'Coligny Paris',
        imageSrc: 'https://www.coligny-paris.com/wp-content/uploads/2023/10/Images-for-beautiful-people-and-tribe-3.png',
        alt: 'Une petite fille regardant par la fenêtre',
        siteUrl: 'https://www.coligny-paris.com/fr/',
        projectUrl: '/projets/coligny-paris',
        darken: true,
        darkenValue: 0.2
    },
    {
        title: 'Draner.com',
        imageSrc: 'https://img.freepik.com/photos-premium/cote-profil-photo-fille-focalisee-developpeur-logiciels-verre-ecran-ordinateur-look-espresso_274222-22774.jpg',
        alt: 'Une femme focalisée sur son ordinateur, un café en main',
        siteUrl: 'https://www.draner.com/',
        projectUrl: '/projets/draner-com',
        darken: true,
        darkenValue: 0.3
    }
]

const carousel = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const activeIndex = ref(0)

const currentSlide = computed(() => slides[activeIndex.value] || null)

const updateActive = (): void => {
    if (!carousel.value) return

    const { clientWidth, scrollLeft } = carousel.value
    const newIndex = Math.round(scrollLeft / clientWidth)

    if (newIndex !== activeIndex.value) {
        activeIndex.value = newIndex
    }
}

const goTo = (index: number): void => {
    if (!carousel.value || index < 0 || index >= slides.length) return

    const x = carousel.value.clientWidth * index
    gsap.to(carousel.value, {
        scrollTo: { x },
        duration: 0.5,
        ease: 'power2.out'
    })
}

let scrollAccumulator = 0
let isScrolling = false

const handleWheel = (event: WheelEvent): void => {
    event.preventDefault()

    if (isScrolling) return

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    scrollAccumulator += delta

    const threshold = 150

    if (Math.abs(scrollAccumulator) >= threshold) {
        isScrolling = true

        if (scrollAccumulator > 0 && activeIndex.value < slides.length - 1) {
            goTo(activeIndex.value + 1)
        } else if (scrollAccumulator < 0 && activeIndex.value > 0) {
            goTo(activeIndex.value - 1)
        }

        scrollAccumulator = 0

        setTimeout(() => {
            isScrolling = false
        }, 600)
    }
}

const animateTitle = (text: string): void => {
    if (!titleRef.value) return

    gsap.to(titleRef.value, {
        duration: 1,
        ease: 'power1.out',
        scrambleText: {
            text,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz',
            revealDelay: 0.3,
            speed: 0.5
        }
    })
}

watch(activeIndex, async () => {
    await nextTick()
    const slide = currentSlide.value
    if (slide) {
        animateTitle(slide.title)
    }
})

onMounted(() => {
    updateActive()
    carousel.value?.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })

    const slide = currentSlide.value
    if (slide) {
        animateTitle(slide.title)
    }
})

onUnmounted(() => {
    carousel.value?.removeEventListener('scroll', updateActive)
    window.removeEventListener('wheel', handleWheel)
})

definePageMeta({ prerender: true })
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