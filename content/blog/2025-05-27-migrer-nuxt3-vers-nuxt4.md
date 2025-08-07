---
date: 2025-05-27
title: "Migrer en douceur de Nuxt 3 vers Nuxt 4"
description: "Guide pas‑à‑pas pour mettre à jour votre codebase Nuxt 3 sans douleur."
tags:
  - migration
  - nuxt3
  - nuxt4
  - vue
featured: true
image: "/images/articles/migration-nuxt4.jpg"
readingTime: 8
---

# Migrer en douceur de Nuxt 3 vers Nuxt 4

La sortie de **Nuxt 4** offre un lot d’améliorations majeures : performance, DX, et support TypeScript renforcé. Je t’explique comment passer à la nouvelle version sans casser ta prod.

## 1. Pré‑requis

- Node ≥ 18
- Vue 3.4
- Une branche “migration” prête à tester

## 2. Mettre à jour les dépendances

```bash prefix="$"
npx nuxi@latest upgrade
pnpm up nuxt@latest
```

Vérifie ensuite les peer‑deps, notamment `vue` et `@vueuse/core`.

## 3. Ajuster la config

Nuxt 4 introduit `runtimeConfig.exposeHeaders`. Compare ton `nuxt.config.ts` :

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    },
    exposeHeaders: ['x-request-id']
  }
})
```

## 4. Tester avec Nitro Preview

```bash
pnpm dev --preset preview
```

Cela simule un environnement Edge afin de capturer les problèmes avant mise en prod.

## Conclusion

Anticipe les breaking changes, écris des tests E2E, et profite d’une base code plus rapide et plus sûre. Bon refacto !