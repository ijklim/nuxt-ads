# Issue Text - Copy This to Create Your GitHub Issue

**Instructions:**
1. Go to https://github.com/ijklim/nuxt-ads/issues/new
2. Copy everything below the line
3. Paste into the issue description
4. Add title: `Refactor: Implement Clean/Hexagonal Architecture`
5. Add labels: `enhancement`, `architecture`, `refactoring`, `technical-debt`
6. Click "Submit new issue"

---

## Refactor Codebase Based on Best Practices and Clean/Hexagonal Architecture

### Problem Statement

The current codebase has architectural issues that make it difficult to maintain and test:

- **Fat components** - Business logic mixed with UI components (see `components/RandomAd.vue`)
- **Tight coupling** - API calls, data parsing, and validation in UI layer
- **Hard to test** - Business logic requires mounting Vue components
- **Configuration leaks** - Runtime config accessed directly in components
- **Security concerns** - `postMessage` to wildcard origin (`*`)

These issues are documented in `project-audit.md`.

### Goal

Refactor the codebase to follow Clean Architecture (Hexagonal Architecture) principles:

1. **Separation of Concerns** - Clear boundaries between layers
2. **Testability** - Business logic testable without UI
3. **Maintainability** - Easier to understand and modify
4. **Flexibility** - Easy to swap implementations (API, storage, etc.)

### Proposed Architecture

**Four Layers:**

```
┌─────────────────────────────────────┐
│   Presentation (Vue components)     │  ← Rendering only
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Application (Use cases)           │  ← Business workflows
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure (API, config)      │  ← External services
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain (Business logic)           │  ← Pure logic, no framework
└─────────────────────────────────────┘
```

**Dependencies flow inward** - outer layers depend on inner layers, never reverse.

### Implementation Plan

#### Phase 1: Domain Layer (Low Risk - 8-10 hours)
- [ ] Create `domain/ads/types.ts` - Ad entities with discriminated unions
- [ ] Create `domain/ads/validators.ts` - Validation logic
- [ ] Create `domain/shared/result.ts` - Result<T, E> type for error handling
- [ ] Create `domain/shared/errors.ts` - Domain-specific errors
- [ ] Write unit tests for validators (no UI dependencies)

#### Phase 2: Application Layer (Medium Risk - 10-12 hours)
- [ ] Create `application/ports/IAdRepository.ts` - Interface for data access
- [ ] Create `application/ports/IConfigProvider.ts` - Interface for configuration
- [ ] Create `application/use-cases/FetchRandomAd.ts` - Fetch and validate ad use case
- [ ] Write unit tests for use cases (mock repositories)

#### Phase 3: Infrastructure Layer (Low Risk - 8-10 hours)
- [ ] Create `infrastructure/api/LaravelAdRepository.ts` - Laravel API implementation
- [ ] Create `infrastructure/api/mappers.ts` - Map API responses to domain models
- [ ] Create `infrastructure/config/RuntimeConfigProvider.ts` - Nuxt config wrapper
- [ ] Add error handling and retries
- [ ] Write integration tests

#### Phase 4: Presentation Layer (High Risk - 12-15 hours)
- [ ] Create `composables/useAdService.ts` - Wraps use cases for Vue
- [ ] Refactor `components/RandomAd.vue` to use composable
- [ ] Update child components (Amazon, Google) to accept domain models
- [ ] Remove business logic from components
- [ ] Update component tests

#### Phase 5: Security & Best Practices (Medium Risk - 6-8 hours)
- [ ] Implement origin-based postMessage filtering (not `*`)
- [ ] Add runtime config validation on startup
- [ ] Add query parameter allowlist
- [ ] Add response schema validation
- [ ] Enable TypeScript strict mode

#### Phase 6: Documentation (Low Risk - 6-8 hours)
- [ ] Update README with architecture diagram
- [ ] Document layer responsibilities
- [ ] Add JSDoc comments to public APIs
- [ ] Achieve 80%+ test coverage
- [ ] Create architecture decision records (ADRs)

### Success Criteria

**Code Quality:**
- [ ] Business logic isolated from UI (100% in `domain/` and `application/`)
- [ ] Test coverage ≥80%
- [ ] Zero `any` types in production code
- [ ] No function with cyclomatic complexity >10

**Functional:**
- [ ] All existing features work identically
- [ ] All existing tests pass
- [ ] No new console errors
- [ ] Performance same or better

**Developer Experience:**
- [ ] Easier to add new ad types
- [ ] Easier to swap API backends
- [ ] Easier to test business logic
- [ ] Clear directory structure

### Example: Before & After

**Before (Current):**
```typescript
// components/RandomAd.vue - 300+ lines
const pickRandomAd = async () => {
  state.isLoading = true
  const url = `${runtimeConfig.public.adsServer}/api/ads?${params}`
  const apiResponse = await $fetch<IResponseFetchAd>(url)
  
  if (apiResponse && isAd(apiResponse)) {
    state.whichAdToShow = {
      adType: apiResponse.ad_type,
      height: parseInt(apiResponse.height),
      // ... more parsing
    }
  }
  state.isLoading = false
}
```

**After (Proposed):**
```typescript
// components/RandomAd.vue - ~50 lines
<script setup>
const { ad, loading, error, fetchAd } = useAdService()
onMounted(() => fetchAd(query))
</script>

<template>
  <AdLoader v-if="loading" />
  <AdError v-else-if="error" :error="error" />
  <AmazonBanner v-else-if="ad?.type === 'AmazonBanner'" :ad="ad" />
</template>
```

### Migration Strategy

- **Incremental** - Implement one phase at a time
- **Backward compatible** - Old and new code coexist during migration
- **Testable** - Each phase independently testable
- **Can pause** - Stop after any phase if needed

### Estimated Effort

**Total:** 40-60 hours (8-12 days part-time)

Can be broken into smaller PRs for each phase.

### References

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [TypeScript Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- Current issues documented in `project-audit.md`

### Discussion

Questions to consider:
- Is this appropriate for a relatively small codebase?
- What's the priority vs other features?
- Should we implement all phases or just 1-3?
- Impact on bundle size?

---

**Priority:** Medium (Technical Debt)  
**Type:** Enhancement, Architecture, Refactoring
