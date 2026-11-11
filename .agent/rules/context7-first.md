# Skills & Context7 Verification Rule

## Mandatory Prerequisite for Library Coding
Whenever asked to implement or update code using:
- `pixi.js`
- `@tanstack/react-query`
- `zustand`
- `framer-motion`
- `recharts`
- `howler`

The agent MUST:
1. Reference the corresponding skill in `.agent/skills/`:
   - `pixijs/` and `pixijs-performance/` for PixiJS game development.
   - `zustand/` for state management patterns.
   - `vercel-react-best-practices/` for React optimization.
   - `animation-performance/` for smooth animations.
2. Call `resolve-library-id` from the `context7` MCP server to get the up-to-date documentation ID.
3. Call `query-docs` on the specific method or pattern needed.
4. Validate that the code uses the latest APIs (e.g. PixiJS v8 async initialization).
