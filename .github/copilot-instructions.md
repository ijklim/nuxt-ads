# Nuxt Ads Project Standards

## 📖 Project Overview
This is a Nuxt 4-based ad server application that displays randomized advertisements from a backend API. The application provides an embeddable script that websites can include to display ads dynamically.

**Key Technologies:**
- **Nuxt 4** - Server-side rendering and static site generation
- **Vue 3** - Composition API with TypeScript
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **pnpm** - Package manager

**Project Structure:**
- `components/` - Vue components (PascalCase naming)
- `composables/` - Vue composables for shared logic
- `server/` - Server API routes and middleware
- `tests/` - Unit and E2E tests
- `public/` - Static assets
- `.github/` - GitHub Actions workflows and Copilot instructions

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

## 📦 Dependency Management
When adding or updating dependencies:
- **Use pnpm** as the package manager (not npm or yarn)
- **Check for vulnerabilities** before adding new packages (`pnpm audit`)
- **Prefer stable versions** unless a specific feature requires a newer version
- **Document why** new dependencies are added in package.json's `dependencyNotes` field if it's not obvious
- **Keep devDependencies separate** from production dependencies
- **Update lockfile** by running `pnpm install` after any package.json changes

**Security:**
- Run `pnpm audit` before committing changes with new dependencies
- Address high and critical vulnerabilities immediately
- For moderate vulnerabilities, assess the risk and update if feasible
- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for sensitive configuration

---

## 🏗️ Build and Development
**Development Server:**
```bash
pnpm dev          # Start dev server on port 8810
```

**Building:**
```bash
pnpm build        # Build for Node.js server deployment
pnpm generate     # Generate static site (used for deployment)
pnpm preview      # Preview production build locally
```

**Important:**
- The project uses **static site generation** (`pnpm generate`) for deployment
- Environment variables must be set **at build time** (they're baked into the static HTML)
- For deployment, GitHub Actions creates `.env` from GitHub Secrets before building
- The development server runs on port 8810 (not the default 3000)

---

## 🚀 Deployment
- **Deployment method:** GitHub Actions with SSH to shared hosting
- **Workflow file:** `.github/workflows/ssh-deploy.yml`
- **Trigger:** Push to `main` branch or manual workflow dispatch
- **Environment variables:** Set in GitHub Secrets, not in `.env` files on the server

**Required GitHub Secrets:**
- `NUXT_PUBLIC_ADS_SERVER` - Backend API URL
- `NUXT_PUBLIC_AD_CLIENT` - Google AdSense Publisher ID
- `SSH_HOST`, `SSH_USERNAME`, `SSH_KEY`, `SSH_PORT`, `SSH_DEPLOY_PATH` - Deployment credentials

---

## 🔍 Common Patterns
**Auto-imports:**
- Nuxt auto-imports composables, components, and utilities
- Do NOT manually import: `useRuntimeConfig`, `useState`, `useFetch`, `useAsyncData`
- Components in `components/` are auto-imported without explicit imports

**Data Fetching:**
- ✅ Use `useFetch` or `useAsyncData` for server-side data
- ✅ Use `$fetch` for API calls in composables
- ❌ Avoid `axios` or plain `fetch` unless necessary for client-side only data

**Component Communication:**
- ✅ Use props and emits for parent-child communication
- ✅ Use `useState` for global state
- ❌ Avoid event buses or global event emitters

---

## ⚠️ Anti-Patterns to Avoid
- ❌ **Don't** add `.env` files to the repository (use `.env.example` for documentation)
- ❌ **Don't** import Nuxt composables manually (they're auto-imported)
- ❌ **Don't** use Options API (use Composition API with `<script setup>`)
- ❌ **Don't** ignore TypeScript errors (fix them, don't use `@ts-ignore`)
- ❌ **Don't** add packages without checking for vulnerabilities first
- ❌ **Don't** commit `node_modules`, `.nuxt`, `.output`, or other build artifacts
- ❌ **Don't** modify tests to make them pass (fix the code instead)
- ❌ **Don't** remove existing tests without a good reason

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
