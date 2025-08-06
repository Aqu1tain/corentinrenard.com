<template>
    <div class="w-1/2 mt-5 fixed left-1/2 -translate-x-1/2 z-10 ">
         <header class="navbar z-10 text-white shadow-sm rounded-xl px-3 bg-neutral-500/20 backdrop-blur-2xl border border-neutral-100/50">
             <div class="flex-1">
                 <ul class="menu ">
                     <li class="w-auto">
                         <NuxtLink to="/" class="text-xl">Corentin Renard</NuxtLink>
                     </li>
                 </ul>
             </div>
             <div class="flex-none">
                 <ul class="menu menu-horizontal px-1 gap-1">
                     <li><NuxtLink active-class="menu-active" to="/portfolio">Portfolio</NuxtLink></li>
                     <li><NuxtLink active-class="menu-active" to="/blog">Blog</NuxtLink></li>
                     <li><NuxtLink active-class="menu-active" to="/contact">Contact</NuxtLink></li>
                     <li><NuxtLink class="tooltip tooltip-bottom" data-tip="Github" external to="https://github.com/Aqu1tain"><Icon name="uil:github" size="21"></Icon></NuxtLink></li>
                 </ul>
             </div>
         </header>
    </div>
</template>

<script lang="ts" setup>


</script>


