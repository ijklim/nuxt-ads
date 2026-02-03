# Project Audit: Layered Architecture

Date: 2026-02-03

## Modular decomposition (proposed)

### Domain layer
**Responsibilities**
- Ad model definitions, validation, parsing, and normalization.
- Ad selection policy and display eligibility.

**Key modules/files (current locations)**
- Domain types embedded in UI component: [components/RandomAd.vue](components/RandomAd.vue)

**Boundary violations**
- Domain types and parsing logic live in a UI component (not reusable, tightly coupled to rendering).
- API response parsing and mapping are coupled to view state.

**High-risk couplings / failure points**
- `parseInt` on potentially empty strings can yield `NaN` and propagate to UI logic.
- No validation of required fields before rendering (e.g., missing `href`, `imagePath`).
- Ad type handling is stringly-typed and scattered (e.g., "MochahostBanner", "ImageAd").

---

### Infrastructure layer
**Responsibilities**
- Runtime configuration, external API access, and network concerns (CORS, fetch).

**Key modules/files**
- Runtime config: [nuxt.config.ts](nuxt.config.ts)
- CORS middleware: [server/middleware/cors-ivan.ts](server/middleware/cors-ivan.ts)
- API access currently embedded in UI: [components/RandomAd.vue](components/RandomAd.vue)

**Boundary violations**
- `$fetch` and URL construction are in the UI component instead of a dedicated infrastructure/composable layer.
- Runtime config access inside the UI component.

**High-risk couplings / failure points**
- Missing or empty `NUXT_PUBLIC_ADS_SERVER` yields invalid requests with no fallback.
- CORS middleware does not apply to static generation (noted in file), which may cause production mismatches.
- No retry, timeout, or error classification for ad server failures.

---

### Interface layer
**Responsibilities**
- UI composition and rendering, layout, interactivity.

**Key modules/files**
- App shell: [app.vue](app.vue)
- Ad display and conditional rendering: [components/RandomAd.vue](components/RandomAd.vue)
- Provider-specific components: [components/Amazon/Banner.vue](components/Amazon/Banner.vue), [components/Google/AdSense.vue](components/Google/AdSense.vue), [components/Mochahost/Banner.vue](components/Mochahost/Banner.vue)

**Boundary violations**
- UI component handles data fetching, response parsing, postMessage messaging, and model logic.

**High-risk couplings / failure points**
- `window.parent.postMessage` is called to `*`, with no origin filtering.
- `notifyParentOfAdDimensions` runs before validating ad display readiness.
- Query params are forwarded verbatim to the backend, making behavior implicit and hard to reason about.

---

## Anti-patterns and refactor suggestions

1. **Fat component / mixed concerns**
   - **Impact:** Hard to test, harder to reuse, brittle to API changes.
   - **Refactor:** Extract data fetching + parsing into `composables/useAdService.ts`; extract domain types to `domain/ads/types.ts`.

2. **Stringly-typed domain**
   - **Impact:** Fragile branching, easy to break with new ad types.
   - **Refactor:** Introduce a discriminated union with explicit validators; map response into a normalized `Ad` model.

3. **Leaky infrastructure concerns in UI**
   - **Impact:** UI breaks when config is missing or API changes.
   - **Refactor:** Centralize runtime config validation in a composable; return typed errors.

4. **Implicit side effects**
   - **Impact:** PostMessage to `*` may expose data to untrusted contexts.
   - **Refactor:** Restrict allowed origins via config; gate calls by known `origin`.

5. **Unvalidated external data**
   - **Impact:** Rendering failures or silent UI breakage.
   - **Refactor:** Validate API responses (e.g., schema validation) before mapping.

---

## Prioritized plan

### High
1. **Move data fetching + parsing into a composable**
   - Effort: Medium
   - Risk reduction: High
   - Targets: [components/RandomAd.vue](components/RandomAd.vue)

2. **Define domain models in a dedicated module**
   - Effort: Low
   - Risk reduction: High
   - Targets: new `domain/ads/` module; update [components/RandomAd.vue](components/RandomAd.vue)

3. **Validate runtime config and API response**
   - Effort: Medium
   - Risk reduction: High
   - Targets: [nuxt.config.ts](nuxt.config.ts), new composable

### Medium
4. **Origin-locked postMessage**
   - Effort: Medium
   - Risk reduction: Medium
   - Targets: [components/RandomAd.vue](components/RandomAd.vue), config in [nuxt.config.ts](nuxt.config.ts)

5. **Explicit error types and UI fallback**
   - Effort: Medium
   - Risk reduction: Medium
   - Targets: [components/RandomAd.vue](components/RandomAd.vue)

### Low
6. **Query param allowlist**
   - Effort: Low
   - Risk reduction: Low
   - Targets: [components/RandomAd.vue](components/RandomAd.vue)
