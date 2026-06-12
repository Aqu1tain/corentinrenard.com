---
title: "Sand.js"
description: "Bibliothèque JavaScript sans dépendance pour des diagrammes sunburst interactifs en SVG : décrits en JSON, publiée sur npm sous licence MIT."
preview: "Un sunburst décrit en JSON, dessiné en SVG."
---

## Contexte

Sand.js, pour Sunburst Advanced Node Data, est une bibliothèque JavaScript open source développée dans le cadre d'une alternance et publiée sur npm. Elle s'adresse aux développeurs qui veulent représenter des données hiérarchiques en diagramme sunburst, ces anneaux concentriques qui se lisent d'un coup d'œil, sans framework imposé ni mise en place laborieuse. L'idée est simple : décrire le graphique en JSON et laisser la bibliothèque calculer la disposition puis dessiner le rendu.

## Approche

Écrite en TypeScript et sans aucune dépendance, la bibliothèque sépare le calcul du rendu : layout() produit les géométries d'arcs pour un usage headless, renderSVG() se charge du dessin et de l'interactivité. La configuration couvre les couches, les modes d'angle, les sunbursts partiels et quatorze palettes de couleurs intégrées ; côté interaction, navigation en drill-down avec transitions, tooltips, fil d'Ariane et surlignage par clé. Le tout est distribué en module ES et en bundle minifié pour CDN, avec des définitions de types complètes.

## Résultat

Une version 1.0.0 publiée sur npm sous licence MIT, aboutissement de seize versions itérées entre septembre 2025 et janvier 2026, accompagnée d'une documentation complète et d'un serveur de démos. Au-delà du graphique, le projet montre le métier d'auteur de bibliothèque : une API à deux niveaux, configuration complète ou raccourci data et radius, une compatibilité navigateurs documentée et un build testé et vérifié.
