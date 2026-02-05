---
agent: Test Planner & Unit Test Writer
model: GPT-5.2-Codex
description: Write or update Vitest unit tests for Nuxt Ads components and composables.
---

Write or update unit tests for the specified Nuxt Ads component or composable.
Use TEST_PLAN.md at the repository root as the source of truth for what to test.
Implement the unit-test cases described there and do not invent new scope.

Requirements and conventions:
- Use Vitest with `globals: true`.
- Use @vue/test-utils `mount()` for components.
- Follow Nuxt auto-import conventions.
- Always include `beforeEach()` to reset mocks and wrappers.
- Mock Nuxt composables and `$fetch` using `(globalThis as any)`.
- Use `async/await` for async renders or data fetching.
- Verify loading, success, and error states separately.
- Use `wrapper.vm as any` for internal state access when needed.
- Avoid snapshot testing unless explicitly requested.
- Keep tests focused, independent, deterministic, and maintainable.
- Use existing fixtures from `tests/fixtures/mockData.ts` when applicable.
- Follow project formatting: 2-space indentation and semicolons.

Write the tests directly to the appropriate file(s) under tests/unit/.