---
title: "Stremio Horizon"
description: "An alternative UI for Stremio that rethinks navigation, layout and visual identity, shipped as a web app and a Tauri desktop app for macOS, Linux and Windows."
preview: "A fresh take on the Stremio interface, from web UI to desktop installers."
---

## Context

Stremio Horizon is my open-source personal project: an alternative interface for the streaming platform Stremio. Based on stremio-web 5 by Smart Code, it goes in a different direction, rethinking navigation, layout and visual identity while keeping full compatibility with the Stremio ecosystem and its addons. It is not a replacement for Stremio, just my take on what a great UI could look like, released under GPL-2.0.

## Approach

On the JavaScript frontend, I rework the main screens: a horizontal tabbed navbar replaces the desktop sidebar, the Board opens on a hero banner carousel, title pages move to a single-column layout with Details, Videos and Streams tabs, and stream lists gain a quality badge parser (4K, HDR, Dolby) with filter chips. I also wrote a companion desktop app in Rust with Tauri, which serves the interface over localhost and spawns a forked stremio-service as a sidecar process for local streaming, packaged into installers for macOS, Linux and Windows.

## Result

I launched it in February 2026 and it now sits at version 0.3.2: an early stage I fully own, usable but not yet stable, where anyone is invited to open an issue or submit a pull request. Everything lives in three GPL-2.0 repositories, the frontend, the desktop app and the streaming service: the first two credit the Smart Code originals they build on, the third is a direct fork of Stremio's own service. A small landing page hands out six installers, from the Apple Silicon .dmg to the Fedora .rpm.
