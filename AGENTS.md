<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Styling (CSS Modules)

- Component styles use `*.module.scss` with readable class names in DevTools.
- Scripts use **Webpack** (`next dev --webpack` / `next build --webpack`) so classes look like `RoadMap__eyebrow`, not `RoadMap-module-scss-module__hash__eyebrow` (Turbopack / Lightning CSS default in Next 16).
- `localIdentName` is set in `next.config.ts` (`[name]__[local]` in dev).
