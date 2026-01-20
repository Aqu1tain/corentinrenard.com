<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <div :class="colorMode.value">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
