# Portfolio (corentinrenard.com)

Nuxt 4 + @nuxt/content (case studies in content/works/{en,fr}, structural data in shared/utils/works.ts), GSAP motion layer, i18n prefix_except_default.

## Critical dev constraint: one Nuxt process at a time

Never run `pnpm typecheck` or `pnpm build` while `pnpm dev` is running. They regenerate `.nuxt/content/` (content dump + database version) under the dev server, whose SQLite import then breaks: all works pages 404, work titles empty, `no such table: _content_works` in the logs.

Correct loop: stop dev, run typecheck/build, restart `pnpm dev`. The dev script purges `.data/content` on start and rebuilds the database cleanly, so a restart always heals this state.
