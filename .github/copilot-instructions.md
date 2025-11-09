# Nuxt Ads Project Standards

## 🧪 Testing

When working on `tests/**/*.test.ts` files:

- Use **Vitest** with `globals: true` for a cleaner syntax.
- Mock external dependencies using `(globalThis as any)` when necessary for global functions (e.g., mock timing APIs).
- Always include `beforeEach()` to reset mocks and clear component wrappers.
- Use `async/await` for component tests and any test involving asynchronous Nuxt composables (like `useFetch`).

---

## 🏗️ Components

When working on `components/**/*.vue` files:

- Use **Composition API** with `<script setup lang="ts">` as the standard.
- Define explicit **TypeScript interfaces** or types for all `defineProps` and `defineEmits`.
- Follow **Nuxt auto-import conventions** (do not manually import composables like `useRuntimeConfig`).
- **File Naming:** Use **PascalCase** for all component names (e.g., `BaseButton.vue`, `AdDisplay.vue`).

---

## ⚡ Project Architecture (Data Fetching)

- **Server-Side Data Fetching:** Prefer using **`useAsyncData`** or **`useFetch`** composables for all server-side data fetching logic.
- **Client-Side Data Fetching:** Only use client-side fetching (e.g., direct `fetch` or Axios) within a `onMounted` hook if the data is strictly non-critical and not required for initial rendering.
- **State Management:** Use **`useState`** for global application state and stick to the standard reactive API for local state.

---

## 📝 Code Style & Formatting

- **Formatting:** All generated code must adhere to the project's **Prettier** formatting rules.
- **Indentation:** Use **two spaces** for indentation.
- **Semicolons:** Semicolons are required at the end of statements.

---

## 💬 Commit Messages

- **Style:** Generate commit messages using the **Conventional Commits** specification.
- **Format:** `type: subject` where subject starts with lowercase (e.g., `feat: add feature` not `feat: Add feature`)
- **Types:** Use `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, or `ci`
- **Rules:**
  - Start subject with lowercase letter
  - Use imperative mood (e.g., "add" not "added" or "adds")
  - Keep subject under 72 characters
  - No period at the end
- **Body:** Include a brief, descriptive body if the change is non-trivial.

---

## 🔀 GitHub Integration (for Copilot Coding Agent)

When creating branches and pull requests for GitHub issues:

### Branch Names

- **Format:** `type/issue-number-short-description`
- **Types:** Match the type to the PR title (feat, fix, docs, style, refactor, perf, test, chore, ci, etc.)
- **Examples:** `feat/1-pr-approval-requirement`, `fix/42-ad-loading-race-condition`
- **Rules:**
  - Use lowercase only.
  - Use hyphens (`-`) to separate words.
  - Include the issue number when applicable.
  - No underscores, trailing slashes, or special characters.

### Pull Request Titles

- **Format:** `type: brief description (closes/fixes #issue-number)`
- **Types:** Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): feat, fix, docs, style, refactor, perf, test, chore, ci, etc.
- **Examples:** `feat: add pull request approval requirement (fixes #1)`, `fix: resolve ad loading race condition (closes #42)`
- **Rules:**
  - Start with a type followed immediately by a colon and a space (`type: `).
  - Use imperative mood with lowercase for description (e.g., "add", "fix", "update").
  - Keep under 72 characters.
  - Include issue reference in parentheses with lowercase keywords (e.g., `(fixes #N)` or `(resolves #N1, #N2)`).
  - No period at the end.
