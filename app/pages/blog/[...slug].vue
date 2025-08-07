<template>
    <div class="w-screen min-h-screen bg-slate-900 flex flex-col items-center">
        <UniversalHeader />

        <main class="mt-32 w-full max-w-4xl px-6 mb-16">
            <article v-if="page" class="space-y-8">
                <!-- Article Header -->
                <header class="text-center space-y-6">
                    <!-- Back Button -->
                    <div class="flex justify-start">
                        <NuxtLink to="/blog">
                            <GlassButton>
                                <Icon name="uil:arrow-left" size="16" class="mr-2" />
                                Retour au blog
                            </GlassButton>
                        </NuxtLink>
                    </div>

                    <!-- Title and Meta -->
                    <div class="space-y-4">
                        <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight">
                            {{ page.title }}
                        </h1>

                        <div class="flex flex-col items-center space-y-2 text-slate-400">
                            <time class="text-sm">
                                Publié le {{ formatDate(page.date) }}
                            </time>
                            <p class="text-lg text-slate-300 max-w-2xl">
                                {{ page.description }}
                            </p>
                        </div>
                    </div>

                    <!-- Featured Image -->
                    <div class="aspect-video rounded-xl overflow-hidden bg-slate-700 border border-neutral-100/20">
                        <NuxtImg
                              class="w-full h-full object-cover"
                              src="https://citygem.app/wp-content/uploads/2024/08/placeholder-1-1.png"
                              :alt="page.title"
                        />
                    </div>
                </header>

                <!-- Article Content -->
                <div class="glass-content rounded-xl p-8 shadow-lg">
                    <ContentRenderer :value="page" />
                </div>

                <!-- Article Footer -->
                <footer class="border-t border-neutral-100/20 pt-8">
                    <div class="flex justify-center">
                        <NuxtLink to="/blog">
                            <GlassButton>
                                <Icon name="uil:arrow-left" size="16" class="mr-2" />
                                Retour au blog
                            </GlassButton>
                        </NuxtLink>
                    </div>
                </footer>
            </article>
        </main>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('blog').path(route.path).first()
})

if (!page.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found'
    })
}

// Format date helper
const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// SEO
useSeoMeta({
    title: page.value?.title,
    description: page.value?.description
})
</script>

<style scoped>
.glass-content {
    background-color: rgb(115 115 115 / 0.2);
    backdrop-filter: blur(32px);
    border: 1px solid rgb(245 245 245 / 0.5);
}

/* Content styling */
.glass-content :deep(h1),
.glass-content :deep(h2),
.glass-content :deep(h3),
.glass-content :deep(h4),
.glass-content :deep(h5),
.glass-content :deep(h6) {
    color: white;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.glass-content :deep(h1) {
    font-size: 1.875rem;
    line-height: 2.25rem;
}

.glass-content :deep(h2) {
    font-size: 1.5rem;
    line-height: 2rem;
}

.glass-content :deep(h3) {
    font-size: 1.25rem;
    line-height: 1.75rem;
}

.glass-content :deep(p) {
    color: rgb(226 232 240);
    line-height: 1.625;
    margin-bottom: 1rem;
}

.glass-content :deep(a) {
    color: rgb(147 197 253);
    text-decoration: underline;
}

.glass-content :deep(a:hover) {
    color: rgb(196 181 253);
}

.glass-content :deep(ul),
.glass-content :deep(ol) {
    color: rgb(226 232 240);
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}

.glass-content :deep(li) {
    margin-bottom: 0.5rem;
}

.glass-content :deep(blockquote) {
    border-left: 4px solid rgb(59 130 246);
    padding-left: 1rem;
    font-style: italic;
    color: rgb(203 213 225);
    background-color: rgb(30 41 59 / 0.5);
    padding: 1rem;
    border-radius: 0 0.5rem 0.5rem 0;
    margin: 1.5rem 0;
}

.glass-content :deep(code) {
    background-color: rgb(30 41 59);
    color: rgb(147 197 253);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.glass-content :deep(pre) {
    background-color: rgb(30 41 59);
    color: rgb(226 232 240);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1rem;
}

.glass-content :deep(pre code) {
    background-color: transparent;
    padding: 0;
}

.glass-content :deep(img) {
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.glass-content :deep(hr) {
    border-color: rgb(245 245 245 / 0.2);
    margin: 2rem 0;
}

.glass-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
}

.glass-content :deep(th),
.glass-content :deep(td) {
    border: 1px solid rgb(245 245 245 / 0.2);
    padding: 1rem;
    color: rgb(226 232 240);
}

.glass-content :deep(th) {
    background-color: rgb(30 41 59 / 0.5);
    font-weight: 600;
}
</style>