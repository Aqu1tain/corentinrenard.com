---
title: "Stremio Horizon"
description: "Une interface alternative pour Stremio qui repense navigation, mise en page et identité visuelle, livrée en web et en application de bureau Tauri pour macOS, Linux et Windows."
preview: "Une relecture de l'interface de Stremio, du web aux installeurs de bureau."
---

## Contexte

Stremio Horizon est mon projet personnel open source : une interface alternative pour la plateforme de streaming Stremio. Basé sur stremio-web 5 de Smart Code, le projet prend une autre direction et repense la navigation, la mise en page et l'identité visuelle, tout en restant pleinement compatible avec l'écosystème Stremio et ses addons. Ce n'est pas un remplacement de Stremio, juste ma vision de ce que pourrait être une belle interface, publiée sous GPL-2.0.

## Approche

Côté frontend JavaScript, je retravaille les principaux écrans : une barre de navigation horizontale à onglets remplace la sidebar, le Board s'ouvre sur un carrousel de bannières, les fiches de titres passent en colonne unique avec des onglets Détails, Vidéos et Streams, et les listes de flux gagnent un parseur de badges de qualité (4K, HDR, Dolby) avec des filtres. J'ai aussi écrit une application de bureau compagnon en Rust avec Tauri, qui sert l'interface en localhost et lance un fork de stremio-service en processus sidecar pour le streaming local, le tout empaqueté en installeurs pour macOS, Linux et Windows.

## Résultat

Je l'ai lancé en février 2026 et il en est aujourd'hui à la version 0.3.2 : un stade précoce assumé, utilisable mais pas encore stable, où chacun est invité à ouvrir une issue ou proposer une pull request. Tout vit dans trois dépôts GPL-2.0, le frontend, l'application de bureau et le service de streaming : les deux premiers créditent les originaux de Smart Code sur lesquels ils s'appuient, le troisième est un fork direct du service de Stremio. Une petite page de téléchargement distribue six installeurs, du .dmg Apple Silicon au .rpm Fedora.
