---
date: 2025-06-10
title: "Optimiser l’accessibilité avec Nuxt 4 et Tailwind"
description: "Découvrez comment implémenter des pratiques d’accessibilité solides dans vos applications Nuxt."
tags:
  - accessibilité
  - nuxt
  - tailwind
  - a11y
image: "/images/articles/nuxt-a11y-cover.jpg"
readingTime: 7
---

# Optimiser l’accessibilité avec Nuxt 4 et Tailwind

L’accessibilité n’est pas une option : c’est une responsabilité. Dans cet article, je te montre comment **Nuxt 4** et **Tailwind** peuvent t’aider à offrir une expérience inclusive — sans sacrifier la vélocité de développement.

## Pourquoi l’accessibilité compte

- **Responsabilité sociale** : rendre le Web universel.
- **SEO** : Google adore les sites accessibles.
- **Performance** : des composants accessibles sont souvent plus légers.

## 1. Utiliser les composants Headless

Les bibliothèques comme `@headlessui/vue` fournissent des primitives complètement accessibles :

```vue
<template>
  <Dialog :open="isOpen" @close="isOpen = false">
    <DialogPanel class="rounded-2xl p-6 shadow-xl">
      <DialogTitle class="text-xl font-semibold">Contactez‑nous</DialogTitle>
      ...
    </DialogPanel>
  </Dialog>
</template>
```

## 2. Tailwind et les styles “prefers‑reduced‑motion”

Ajoute un support natif pour les utilisateurs qui cherchent à limiter les animations :

```css
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
```

## 3. Audit avec Lighthouse

Exécute :

```bash
npx lhci autorun
```

et vise un score **A11y ≥ 95**.

## Conclusion

Avec peu d’efforts, tu proposes un produit plus inclusif et conforme aux standards WCAG 2.2. Alors, prête à rendre le web meilleur ?