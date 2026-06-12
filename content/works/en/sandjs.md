---
title: "Sand.js"
description: "A zero-dependency JavaScript library for interactive SVG sunburst charts: described in JSON, published on npm under the MIT license."
preview: "A sunburst described in JSON, drawn in SVG."
---

## Context

Sand.js, short for Sunburst Advanced Node Data, is my open-source JavaScript library, built during my apprenticeship and published on npm. It is aimed at developers who need to visualise hierarchical data as sunburst charts, those concentric rings that read at a glance, without a mandated framework or a heavy setup. The idea is simple: describe the chart in JSON and let the library handle both layout computation and rendering.

## Approach

I wrote it in TypeScript with zero dependencies, separating layout from rendering: layout() returns arc geometries for headless use, renderSVG() takes care of drawing and interactivity. The configuration covers layers, angle modes, partial sunbursts and fourteen built-in colour palettes; on the interactive side, drill-down navigation with smooth transitions, tooltips, breadcrumbs and key-based highlighting. Everything ships as an ES module and a minified CDN bundle, with full TypeScript type definitions.

## Result

A 1.0.0 release on npm under the MIT license, the outcome of sixteen versions iterated between September 2025 and January 2026, backed by complete documentation and a live demo server. Beyond the chart itself, it taught me the craft of a library author: a two-level API, full configuration or a data and radius shorthand, documented browser support, and a build that is tested and verified.
