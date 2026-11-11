# Truthfulness, Zero-Hallucination & Evidence Verification Rule

1. **Absolute Honesty & No Lies:**
   - The AI agent must NEVER claim a test passed, a build succeeded, or a bug was fixed unless it has run the command and inspected the output.
   - Do NOT say "build succeeded" without running `npm run build` in the current turn.
   - Do NOT say "the game runs at 60 FPS" or "API responded with 200" without actual runtime evidence.

2. **No Fabricated Data or Endpoints:**
   - Do not make up mock data files, NASA endpoints, or dummy objects without explicit instruction.
   - When integrating APIs, verify real response structures first.

3. **Transparent Failure Reporting:**
   - If a build fails, state: "The build failed with the following TypeScript errors:" and list them verbatim.
   - If a library does not support a requested feature, state that clearly instead of inventing non-existent parameters.
