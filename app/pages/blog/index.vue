<template>
    <div class="w-screen min-h-screen bg-slate-900 flex flex-col items-center">
        <UniversalHeader />

        <main class="mt-32 w-full max-w-4xl px-6 flex flex-col gap-8">
            <!-- Header Section -->
            <div class="text-center text-white space-y-4">
                <h1 class="text-4xl font-bold">Blog</h1>
                <p class="text-lg text-slate-300 max-w-2xl mx-auto">
                    Mes réflexions du moment sur l'UI/UX design, le dev et la tech en général.
                </p>
            </div>

            <!-- Blog Posts Grid -->
            <div class="grid gap-8 pb-16">
                <article
                      v-for="post in posts"
                      :key="post.id"
                      class="glass-card group cursor-pointer transition-all duration-300 rounded-xl p-6 shadow-lg"
                >
                    <div class="flex flex-col md:flex-row gap-6">
                        <!-- Post Image -->
                        <div class="md:w-1/3 flex-shrink-0">
                            <div class="rounded-lg overflow-hidden bg-slate-700">
                                <NuxtImg
                                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      src="https://citygem.app/wp-content/uploads/2024/08/placeholder-1-1.png"
                                      :alt="post.title"
                                />
                            </div>
                        </div>

                        <!-- Post Content -->
                        <div class="md:w-2/3 flex flex-col justify-between space-y-4">
                            <div>
                                <h2 class="text-2xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                                    {{ post.title }}
                                </h2>
                                <p class="text-slate-300 mt-2 line-clamp-3">
                                    {{ post.description }}
                                </p>
                            </div>

                            <div class="flex items-center justify-between">
                                <time class="text-sm text-slate-400">
                                    {{ formatDate(post.date) }}
                                </time>
                                <NuxtLink :to="post.path">
                                    <GlassButton>Lire l'article</GlassButton>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Empty State -->
            <div v-if="!posts || posts.length === 0" class="text-center py-16">
                <div class="text-slate-400 text-lg">
                    No blog posts found yet. Check back soon!
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData('blogs', () =>
      queryCollection('blog').order('date', 'DESC').all()
)

if (!posts.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Blog posts not found',
        fatal: true
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
</script>

<style scoped>
.glass-card {
    background-color: rgb(115 115 115 / 0.2);
    backdrop-filter: blur(32px);
    border: 1px solid rgb(245 245 245 / 0.5);
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>