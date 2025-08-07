<!-- components/content/ProsePre.vue -->
<template>
    <!-- Mock-up DaisyUI -->
    <div class="mockup-code w-full mb-2">
        <!-- Shiki conserve ses classes de coloration -->
        <pre :class="['!bg-transparent !my-0 !p-0 !flex', $props.class]"><code><slot/></code></pre>
    </div>
</template>

<script setup lang="ts">
defineProps({
    code:       { type: String,  default: ''      },
    language:   { type: String,  default: null    },
    filename:   { type: String,  default: null    },
    highlights: { type: Array  as () => number[], default: () => [] },
    meta:       { type: String,  default: null    },
    class:      { type: String,  default: null    },
});
</script>

<style>
pre code .line {
    display: block;
}
</style>
