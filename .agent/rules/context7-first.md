# Context7-First Verification Rule

## Mandatory Prerequisite for Library Coding
Whenever asked to implement or update code using:
- `pixi.js`
- `@tanstack/react-query`
- `zustand`
- `framer-motion`
- `recharts`
- `howler`

The agent MUST:
1. Call `resolve-library-id` from the `context7` MCP server to get the up-to-date documentation ID.
2. Call `query-docs` on the specific method or pattern needed.
3. Validate that the code uses the latest APIs (e.g. PixiJS v8 async initialization).
4. If Context7 is not reachable, consult `.agent/skills/pixi-v8-patterns.md` as an authoritative local reference.
