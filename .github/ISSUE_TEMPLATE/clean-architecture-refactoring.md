---
name: Clean/Hexagonal Architecture Refactoring
about: Refactor codebase to follow Clean Architecture and best practices
title: 'Refactor: Implement Clean/Hexagonal Architecture'
labels: ['enhancement', 'architecture', 'refactoring', 'technical-debt']
assignees: ''
---

# Refactor: Implement Clean/Hexagonal Architecture

## 📋 Overview

Refactor the Nuxt Ads codebase to follow Clean Architecture (Hexagonal Architecture) principles, improving maintainability, testability, and separation of concerns. This refactoring addresses architectural issues identified in `project-audit.md` and implements industry best practices.

## 🎯 Goals

1. **Separation of Concerns** - Clear boundaries between domain, application, infrastructure, and presentation layers
2. **Testability** - Easier to write unit tests for business logic without UI dependencies
3. **Maintainability** - Easier to understand, modify, and extend the codebase
4. **Flexibility** - Easier to swap implementations (e.g., different API backends, storage mechanisms)
5. **Type Safety** - Stronger TypeScript types with proper validation

## 🏗️ Proposed Architecture

### Layer 1: Domain Layer (Core Business Logic)

**Purpose**: Contains business entities, value objects, and business rules. No dependencies on external frameworks or libraries.

**Proposed Structure**:
```
domain/
├── ads/
│   ├── types.ts              # Ad domain models (discriminated unions)
│   ├── validators.ts         # Ad validation logic
│   ├── parsers.ts            # Parse API responses to domain models
│   └── policies.ts           # Ad selection and display eligibility rules
└── shared/
    ├── result.ts             # Result<T, E> type for error handling
    └── errors.ts             # Domain-specific error types
```

**Key Types**:
```typescript
// domain/ads/types.ts
export type AdType = 'AmazonBanner' | 'GoogleAdSense' | 'ImageAd'

export interface BaseAd {
  id: string
  type: AdType
  displayRatio: number
}

export interface AmazonAd extends BaseAd {
  type: 'AmazonBanner'
  height: number
  width: number
  href: string
  imageUrl: string
  imageAlt: string
  imageDescription?: string
  price?: number
  discountAmount?: string
}

export interface GoogleAd extends BaseAd {
  type: 'GoogleAdSense'
  format: string
  layoutKey: string
  slot: number
}

export interface ImageAd extends BaseAd {
  type: 'ImageAd'
  height: number
  width: number
  href: string
  imageUrl: string
  imageAlt: string
}

export type Ad = AmazonAd | GoogleAd | ImageAd

// Discriminated union helper
export function isAmazonAd(ad: Ad): ad is AmazonAd {
  return ad.type === 'AmazonBanner'
}
```

**Validators**:
```typescript
// domain/ads/validators.ts
import { Result } from '../shared/result'
import { ValidationError } from '../shared/errors'

export function validateAmazonAd(data: unknown): Result<AmazonAd, ValidationError> {
  // Validation logic with proper type guards
}

export function validateGoogleAd(data: unknown): Result<GoogleAd, ValidationError> {
  // Validation logic
}
```

---

### Layer 2: Application Layer (Use Cases)

**Purpose**: Orchestrates domain logic and infrastructure. Contains application-specific business rules.

**Proposed Structure**:
```
application/
├── ports/
│   ├── IAdRepository.ts      # Interface for ad data access
│   └── IConfigProvider.ts    # Interface for configuration
└── use-cases/
    ├── FetchRandomAd.ts      # Use case: Fetch and validate random ad
    └── CalculateDimensions.ts # Use case: Calculate iframe dimensions
```

**Example Use Case**:
```typescript
// application/use-cases/FetchRandomAd.ts
import type { Ad } from '~/domain/ads/types'
import type { IAdRepository } from '~/application/ports/IAdRepository'
import { Result } from '~/domain/shared/result'

export class FetchRandomAdUseCase {
  constructor(private adRepository: IAdRepository) {}

  async execute(filters?: AdFilters): Promise<Result<Ad, Error>> {
    try {
      const rawAd = await this.adRepository.fetchRandom(filters)
      const validated = validateAd(rawAd)
      return Result.ok(validated)
    } catch (error) {
      return Result.err(new AdFetchError(error))
    }
  }
}
```

---

### Layer 3: Infrastructure Layer (External Concerns)

**Purpose**: Implements interfaces defined in the application layer. Handles external dependencies like APIs, storage, configuration.

**Proposed Structure**:
```
infrastructure/
├── api/
│   ├── LaravelAdRepository.ts  # Implementation of IAdRepository
│   ├── httpClient.ts           # Configured $fetch wrapper
│   └── mappers.ts              # Map API responses to domain models
├── config/
│   ├── RuntimeConfigProvider.ts # Implementation of IConfigProvider
│   └── validation.ts            # Validate runtime config
└── messaging/
    └── IframeMessenger.ts       # PostMessage communication
```

**Repository Implementation**:
```typescript
// infrastructure/api/LaravelAdRepository.ts
import type { IAdRepository } from '~/application/ports/IAdRepository'
import { parseAdResponse } from './mappers'

export class LaravelAdRepository implements IAdRepository {
  constructor(
    private baseUrl: string,
    private httpClient: typeof $fetch
  ) {}

  async fetchRandom(filters?: AdFilters): Promise<Ad> {
    const params = new URLSearchParams({ random: '1', ...filters })
    const response = await this.httpClient(
      `${this.baseUrl}/api/ads?${params}`
    )
    return parseAdResponse(response)
  }
}
```

**Config Provider**:
```typescript
// infrastructure/config/RuntimeConfigProvider.ts
import type { IConfigProvider } from '~/application/ports/IConfigProvider'

export class NuxtConfigProvider implements IConfigProvider {
  private config = useRuntimeConfig()

  getAdsServerUrl(): string {
    if (!this.config.public.adsServer) {
      throw new ConfigurationError('NUXT_PUBLIC_ADS_SERVER is not set')
    }
    return this.config.public.adsServer
  }

  getAdClient(): string {
    return this.config.public.adClient || ''
  }
}
```

---

### Layer 4: Presentation Layer (UI Components)

**Purpose**: Vue components focused solely on rendering and user interaction. Delegates business logic to composables.

**Proposed Structure**:
```
components/
├── RandomAd.vue              # Simplified - only rendering logic
├── Amazon/
│   └── Banner.vue            # Display logic only
├── Google/
│   └── AdSense.vue           # Display logic only
└── shared/
    ├── AdLoader.vue          # Loading state component
    └── AdError.vue           # Error display component

composables/
├── useAdService.ts           # Composable wrapping use cases
├── useAdDimensions.ts        # Composable for dimension calculations
└── useUtility.ts             # Keep existing utility
```

**Simplified Component**:
```typescript
// components/RandomAd.vue
<script setup lang="ts">
import { useAdService } from '~/composables/useAdService'

const { query } = useRoute()
const { ad, loading, error, fetchAd } = useAdService()

onMounted(() => {
  fetchAd(query)
})
</script>

<template>
  <div class="text-center">
    <AdLoader v-if="loading" />
    <AdError v-else-if="error" :error="error" />
    
    <GoogleAdSense
      v-else-if="ad?.type === 'GoogleAdSense'"
      :ad="ad"
    />
    
    <AmazonBanner
      v-else-if="ad?.type === 'AmazonBanner'"
      :ad="ad"
    />
    
    <ImageAdDisplay
      v-else-if="ad?.type === 'ImageAd'"
      :ad="ad"
    />
    
    <button
      v-if="query?.sb === '1'"
      @click="fetchAd(query)"
    >
      Shuffle
    </button>
  </div>
</template>
```

**Composable**:
```typescript
// composables/useAdService.ts
import { FetchRandomAdUseCase } from '~/application/use-cases/FetchRandomAd'
import { LaravelAdRepository } from '~/infrastructure/api/LaravelAdRepository'
import { NuxtConfigProvider } from '~/infrastructure/config/RuntimeConfigProvider'

export function useAdService() {
  const configProvider = new NuxtConfigProvider()
  const repository = new LaravelAdRepository(
    configProvider.getAdsServerUrl(),
    $fetch
  )
  const useCase = new FetchRandomAdUseCase(repository)

  const ad = ref<Ad | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchAd = async (filters?: Record<string, string>) => {
    loading.value = true
    error.value = null
    
    const result = await useCase.execute(filters)
    
    if (result.isOk()) {
      ad.value = result.value
    } else {
      error.value = result.error
      console.error('[useAdService] Failed to fetch ad:', result.error)
    }
    
    loading.value = false
  }

  return {
    ad: readonly(ad),
    loading: readonly(loading),
    error: readonly(error),
    fetchAd,
  }
}
```

---

## 🔧 Refactoring Steps

### Phase 1: Foundation (Domain Layer)
- [ ] Create `domain/ads/types.ts` with discriminated unions
- [ ] Create `domain/ads/validators.ts` with validation logic
- [ ] Create `domain/shared/result.ts` for type-safe error handling
- [ ] Create `domain/shared/errors.ts` for domain-specific errors
- [ ] Write unit tests for validators (no UI dependencies)

### Phase 2: Application Layer
- [ ] Create `application/ports/IAdRepository.ts` interface
- [ ] Create `application/ports/IConfigProvider.ts` interface
- [ ] Create `application/use-cases/FetchRandomAd.ts`
- [ ] Write unit tests for use cases (mock repositories)

### Phase 3: Infrastructure Layer
- [ ] Create `infrastructure/api/LaravelAdRepository.ts`
- [ ] Create `infrastructure/api/mappers.ts` for API-to-domain mapping
- [ ] Create `infrastructure/config/RuntimeConfigProvider.ts`
- [ ] Add proper error handling and retries
- [ ] Write integration tests (can mock API)

### Phase 4: Presentation Layer
- [ ] Create `composables/useAdService.ts` wrapping use cases
- [ ] Refactor `components/RandomAd.vue` to use composable
- [ ] Update child components to accept domain models
- [ ] Remove business logic from components
- [ ] Update existing component tests

### Phase 5: Security & Best Practices
- [ ] Implement origin-based postMessage filtering (not `*`)
- [ ] Add runtime config validation on startup
- [ ] Add query parameter allowlist
- [ ] Add response schema validation (e.g., zod or valibot)
- [ ] Add proper TypeScript strict mode checks

### Phase 6: Documentation & Testing
- [ ] Update README with new architecture diagram
- [ ] Document layer responsibilities
- [ ] Add JSDoc comments to public APIs
- [ ] Achieve 80%+ test coverage
- [ ] Create architecture decision records (ADRs)

---

## 📊 Success Criteria

### Code Quality Metrics
- [ ] **Separation of Concerns**: Business logic isolated from UI (100% of domain logic in `domain/` and `application/`)
- [ ] **Test Coverage**: ≥80% code coverage with unit tests
- [ ] **Type Safety**: Zero `any` types in production code
- [ ] **Cyclomatic Complexity**: No function with complexity >10

### Functional Requirements
- [ ] All existing features work identically (no user-facing changes)
- [ ] All existing tests pass
- [ ] No new console errors or warnings
- [ ] Performance remains the same or improves

### Developer Experience
- [ ] Easier to add new ad types (extend domain models)
- [ ] Easier to swap API backends (implement `IAdRepository`)
- [ ] Easier to test business logic (isolated from Nuxt/Vue)
- [ ] Clear directory structure with README in each layer

---

## 🚨 Anti-Patterns to Avoid

### ❌ Don't Do This:
```typescript
// Mixing UI and business logic
<script setup>
const fetchAd = async () => {
  const response = await $fetch(url)  // Infrastructure concern in UI
  if (response.ad_type === 'Amazon') { // Business logic in UI
    // Parse and validate
  }
}
</script>
```

### ✅ Do This Instead:
```typescript
// Separated concerns
<script setup>
const { ad, loading, fetchAd } = useAdService()  // UI delegates to composable

onMounted(() => fetchAd())
</script>
```

---

## 📚 References

### Clean Architecture Resources
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Vue.js Enterprise Boilerplate](https://github.com/chrisvfritz/vue-enterprise-boilerplate)
- [Nuxt Layers Documentation](https://nuxt.com/docs/guide/going-further/layers)

### TypeScript Best Practices
- [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Result Type Pattern](https://imhoff.blog/posts/using-results-in-typescript)

---

## 🔄 Migration Strategy

### Backward Compatibility
- Refactor incrementally, one layer at a time
- Keep existing code working during migration
- Use feature flags if needed for gradual rollout
- Maintain existing test suite while adding new tests

### Rollback Plan
- Each phase is independently testable
- Can pause after any phase without breaking production
- Original code remains until replacement is proven

---

## 💬 Discussion Points

- **Performance Impact**: Will additional abstraction layers impact bundle size or runtime performance?
- **Learning Curve**: How do we onboard new contributors to this architecture?
- **Over-Engineering**: Is this appropriate for a relatively small codebase? (Currently ~500 lines)
- **Nuxt Conventions**: How do we balance Clean Architecture with Nuxt's opinionated structure?

---

## 📝 Acceptance Checklist

Before closing this issue, verify:

- [ ] All layers (domain, application, infrastructure, presentation) are properly separated
- [ ] Business logic is testable without UI dependencies
- [ ] All existing functionality works identically
- [ ] Test coverage ≥80%
- [ ] No TypeScript `any` types in production code
- [ ] Documentation updated (README, architecture diagrams)
- [ ] Code review completed by at least 2 maintainers
- [ ] Performance benchmarks show no regression
- [ ] Security audit passed (no new vulnerabilities)

---

## 🏷️ Related Issues

- Addresses architectural concerns in `project-audit.md`
- Related to testing improvements in `TESTING.md`
- Supports contribution guidelines in `CONTRIBUTING.md`

---

## 👥 Stakeholders

**Primary**: @ijklim (repository owner)  
**Reviewers**: TBD  
**Estimated Effort**: 40-60 hours (8-12 days part-time)  
**Priority**: Medium (Technical Debt - Not blocking features)

---

**NOTE**: This is a comprehensive refactoring plan. We can implement it in phases and pause/adjust based on team feedback and project needs.
