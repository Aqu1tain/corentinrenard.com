<template>
    <div class="w-screen h-screen fixed top-0 left-0 bg-slate-900 flex flex-col items-center">
        <UniversalHeader />
        <div class="text-white border border-red-800 mt-28 w-2/3 flex flex-col gap-5">
            <h1 class="text-3xl">Articles de blog</h1>
            <p>Some of my recent thoughts on design, development, and the tech industry.</p>

            <div v-for="post in posts" class="flex gap-11">
                <NuxtImg class="w-[300px]" src="https://citygem.app/wp-content/uploads/2024/08/placeholder-1-1.png"></NuxtImg>
                <div class="flex flex-col">
                    <h2>{{post.title}}</h2>
                    <p>{{post.description}}</p>
                    <NuxtLink :to="post.path"><GlassButton>Lire l'article</GlassButton></NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData('blogs', () =>
      queryCollection('blog').order('date', 'DESC').all()
)
if (!posts.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'blogs posts not found',
        fatal: true
    })
}
</script>