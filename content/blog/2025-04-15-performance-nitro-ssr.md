---
date: 2025-04-15
title: "Performance Web : tirer parti de Nitro et du rendu à la demande"
description: "Boostez les performances de vos pages grâce au moteur Nitro et au streaming côté serveur."
tags:
  - performance
  - nitro
  - ssr
image: "/images/articles/nitro-performance.jpg"
readingTime: 6
---

# Performance Web : tirer parti de Nitro et du rendu à la demande

Les délais de chargement impactent directement le taux de conversion. **Nitro**, le moteur sous‑jacent de Nuxt, propose une approche server‑first avec un streaming natif.

## 1. Activer l’in‑crémental static regeneration (ISR)

Dans `nuxt.config.ts` :

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
    prerender: {
      routes: ['/']
    },
    experimental: {
      payloadExtraction: false
    }
  }
})
```

## 2. Utiliser l’edge caching

Configure des en‑têtes :

```ts
export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate')
})
```

## 3. Monitorer avec Nuxt DevTools

L’onglet “Nitro” affiche le temps passé dans chaque middleware ; cible < 50 ms.

## Conclusion

En combinant Nitro, ISR et du caching malin, tu obtiens un Time to First Byte qui frôle les 100 ms, même sur mobile. 🚀