---
agent: agent
model: GPT-5.2-Codex
description: Analyze the codebase for domain, infrastructure, and interface boundaries and propose a modular decomposition.
---

Analyze this project and propose a modular decomposition across domain, infrastructure, and interface layers.

For each layer, list:
- Responsibilities and key modules/files
- Current violations of boundaries
- High-risk couplings and potential failure points

Identify anti-patterns (e.g., leaky abstractions, cyclic dependencies, shared mutable state), explain their impact, and suggest concrete refactors.

Provide a prioritized plan (high/medium/low) with estimated effort and expected risk reduction.

Write the final output to project-audit.md at the repository root.