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
- **Prefixes:** Use prefixes like `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, or `chore:` (e.g., `feat: implement dark mode toggle`).
- **Body:** Include a brief, descriptive body if the change is non-trivial.