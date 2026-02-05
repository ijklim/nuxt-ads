# Clean Architecture Implementation Guide

This document provides detailed guidance on implementing Clean/Hexagonal Architecture in the Nuxt Ads project.

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Components   │  │ Composables  │  │ Pages        │       │
│  │  .vue files  │  │  .ts files   │  │  .vue files  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │ uses
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌──────────────┐  ┌──────────────────────────────────┐     │
│  │   Ports      │  │        Use Cases                 │     │
│  │ (Interfaces) │  │  - FetchRandomAd                 │     │
│  │              │  │  - CalculateDimensions           │     │
│  └──────────────┘  └──────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │ implements
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ API Adapters │  │ Config       │  │ Messaging    │       │
│  │ (Laravel)    │  │ Providers    │  │ (postMessage)│       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │ uses
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Entities    │  │  Validators  │  │  Policies    │       │
│  │  (Ad types)  │  │  (Rules)     │  │  (Logic)     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Principles

### 1. Dependency Rule
**Dependencies point inward**: Outer layers depend on inner layers, never the reverse.

```
Presentation → Application → Domain
Infrastructure → Application → Domain
```

### 2. Layer Isolation
Each layer has a single, well-defined responsibility:

| Layer | Responsibility | Dependencies |
|-------|---------------|--------------|
| **Domain** | Business logic and entities | None (pure TypeScript) |
| **Application** | Use cases and orchestration | Domain only |
| **Infrastructure** | External concerns (API, DB, etc.) | Application + Domain |
| **Presentation** | UI rendering and user interaction | Application + Domain |

### 3. Interface Segregation
Inner layers define interfaces (ports); outer layers implement them.

```typescript
// Application layer defines the interface
interface IAdRepository {
  fetchRandom(filters?: AdFilters): Promise<Ad>
}

// Infrastructure layer implements it
class LaravelAdRepository implements IAdRepository {
  async fetchRandom(filters?: AdFilters): Promise<Ad> {
    // Implementation details
  }
}
```

## 📁 Proposed Directory Structure

```
nuxt-ads/
├── domain/                          # Pure business logic (no framework deps)
│   ├── ads/
│   │   ├── types.ts                 # Ad entities (discriminated unions)
│   │   ├── validators.ts            # Validation logic
│   │   ├── parsers.ts               # Data transformation
│   │   └── policies.ts              # Business rules
│   └── shared/
│       ├── result.ts                # Result<T, E> type
│       └── errors.ts                # Domain errors
│
├── application/                     # Use cases and ports
│   ├── ports/
│   │   ├── IAdRepository.ts         # Interface for data access
│   │   └── IConfigProvider.ts       # Interface for configuration
│   └── use-cases/
│       ├── FetchRandomAd.ts         # Fetch and validate ad use case
│       └── CalculateDimensions.ts   # Dimension calculation use case
│
├── infrastructure/                  # External integrations
│   ├── api/
│   │   ├── LaravelAdRepository.ts   # Laravel API implementation
│   │   ├── httpClient.ts            # $fetch wrapper
│   │   └── mappers.ts               # API → Domain mapping
│   ├── config/
│   │   ├── RuntimeConfigProvider.ts # Nuxt config implementation
│   │   └── validation.ts            # Config validation
│   └── messaging/
│       └── IframeMessenger.ts       # postMessage wrapper
│
├── composables/                     # Vue composables (glue layer)
│   ├── useAdService.ts              # Wraps use cases for Vue
│   ├── useAdDimensions.ts           # Dimension calculations
│   └── useUtility.ts                # Existing utilities
│
├── components/                      # Vue components (presentation)
│   ├── RandomAd.vue                 # Main ad component
│   ├── Amazon/
│   │   └── Banner.vue               # Amazon-specific display
│   ├── Google/
│   │   └── AdSense.vue              # Google AdSense display
│   └── shared/
│       ├── AdLoader.vue             # Loading state
│       └── AdError.vue              # Error display
│
└── tests/
    ├── unit/
    │   ├── domain/                  # Domain logic tests (fast)
    │   ├── application/             # Use case tests (mocked)
    │   └── components/              # Component tests
    └── e2e/                         # End-to-end tests
```

## 🔍 Layer Details

### Domain Layer (Inner Circle)

**What belongs here:**
- Pure business entities (Ad types)
- Validation rules (is this a valid ad?)
- Business policies (should this ad be shown?)
- Domain-specific errors

**What doesn't belong here:**
- Framework code (Vue, Nuxt)
- API calls or HTTP
- UI components
- External libraries (except type-only)

**Example:**
```typescript
// domain/ads/types.ts
export type AdType = 'AmazonBanner' | 'GoogleAdSense' | 'ImageAd'

export interface AmazonAd {
  type: 'AmazonBanner'
  id: string
  displayRatio: number
  height: number
  width: number
  href: string
  imageUrl: string
  imageAlt: string
  price?: number
}

// Type guard
export function isAmazonAd(ad: unknown): ad is AmazonAd {
  return typeof ad === 'object' &&
         ad !== null &&
         'type' in ad &&
         ad.type === 'AmazonBanner'
}
```

### Application Layer

**What belongs here:**
- Use cases (high-level business flows)
- Port interfaces (contracts for outer layers)
- Application-specific errors

**What doesn't belong here:**
- Implementation details (how to fetch data)
- UI logic
- Framework-specific code

**Example:**
```typescript
// application/ports/IAdRepository.ts
export interface IAdRepository {
  fetchRandom(filters?: AdFilters): Promise<Ad>
  fetchById(id: string): Promise<Ad>
}

// application/use-cases/FetchRandomAd.ts
export class FetchRandomAdUseCase {
  constructor(private repository: IAdRepository) {}

  async execute(filters?: AdFilters): Promise<Result<Ad, Error>> {
    try {
      const ad = await this.repository.fetchRandom(filters)

      // Business validation
      if (!this.isValidAd(ad)) {
        return Result.err(new InvalidAdError('Ad failed validation'))
      }

      return Result.ok(ad)
    } catch (error) {
      return Result.err(new AdFetchError(error))
    }
  }

  private isValidAd(ad: Ad): boolean {
    // Domain validation logic
    return ad.displayRatio > 0 && ad.href !== ''
  }
}
```

### Infrastructure Layer

**What belongs here:**
- API client implementations
- Configuration providers
- External service adapters
- Database adapters (if any)

**What doesn't belong here:**
- Business logic
- UI components
- Use cases

**Example:**
```typescript
// infrastructure/api/LaravelAdRepository.ts
import type { IAdRepository } from '~/application/ports/IAdRepository'
import type { Ad } from '~/domain/ads/types'
import { parseAdResponse } from './mappers'

export class LaravelAdRepository implements IAdRepository {
  constructor(
    private baseUrl: string,
    private httpClient: typeof $fetch
  ) {}

  async fetchRandom(filters?: AdFilters): Promise<Ad> {
    const params = new URLSearchParams({ random: '1' })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, value)
      })
    }

    const response = await this.httpClient(
      `${this.baseUrl}/api/ads?${params}`
    )

    // Map API response to domain model
    return parseAdResponse(response)
  }

  async fetchById(id: string): Promise<Ad> {
    const response = await this.httpClient(
      `${this.baseUrl}/api/ads/${id}`
    )
    return parseAdResponse(response)
  }
}
```

### Presentation Layer

**What belongs here:**
- Vue components (rendering)
- Composables (glue between Vue and use cases)
- User interaction handlers
- UI state management

**What doesn't belong here:**
- Business validation
- API calls (use composables → use cases → repositories)
- Data transformation (use domain parsers)

**Example:**
```typescript
// composables/useAdService.ts
export function useAdService() {
  // Setup dependencies
  const configProvider = new NuxtConfigProvider()
  const repository = new LaravelAdRepository(
    configProvider.getAdsServerUrl(),
    $fetch
  )
  const useCase = new FetchRandomAdUseCase(repository)

  // Reactive state
  const ad = ref<Ad | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Methods
  const fetchAd = async (filters?: Record<string, string>) => {
    loading.value = true
    error.value = null

    const result = await useCase.execute(filters)

    if (result.isOk()) {
      ad.value = result.value
    } else {
      error.value = result.error
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

## 🧪 Testing Strategy

### Domain Layer Tests
**Fast, isolated, no mocks needed**

```typescript
// tests/unit/domain/validators.test.ts
import { validateAmazonAd } from '~/domain/ads/validators'

describe('validateAmazonAd', () => {
  it('validates a correct Amazon ad', () => {
    const validAd = {
      type: 'AmazonBanner',
      id: '123',
      displayRatio: 300,
      height: 250,
      width: 300,
      href: 'https://amazon.com',
      imageUrl: '/image.jpg',
      imageAlt: 'Product',
    }

    const result = validateAmazonAd(validAd)

    expect(result.isOk()).toBe(true)
  })

  it('rejects ad with missing required fields', () => {
    const invalidAd = { type: 'AmazonBanner' }

    const result = validateAmazonAd(invalidAd)

    expect(result.isErr()).toBe(true)
  })
})
```

### Application Layer Tests
**Mock ports/interfaces, test use case logic**

```typescript
// tests/unit/application/FetchRandomAd.test.ts
import { FetchRandomAdUseCase } from '~/application/use-cases/FetchRandomAd'

describe('FetchRandomAdUseCase', () => {
  it('returns ad when repository succeeds', async () => {
    // Mock repository
    const mockRepository = {
      fetchRandom: vi.fn().mockResolvedValue({
        type: 'AmazonBanner',
        id: '123',
        // ... valid ad
      })
    }

    const useCase = new FetchRandomAdUseCase(mockRepository)
    const result = await useCase.execute()

    expect(result.isOk()).toBe(true)
    expect(mockRepository.fetchRandom).toHaveBeenCalled()
  })

  it('returns error when repository fails', async () => {
    const mockRepository = {
      fetchRandom: vi.fn().mockRejectedValue(new Error('Network error'))
    }

    const useCase = new FetchRandomAdUseCase(mockRepository)
    const result = await useCase.execute()

    expect(result.isErr()).toBe(true)
  })
})
```

### Integration Tests
**Test infrastructure implementations**

```typescript
// tests/integration/LaravelAdRepository.test.ts
import { LaravelAdRepository } from '~/infrastructure/api/LaravelAdRepository'

describe('LaravelAdRepository', () => {
  it('fetches ad from real API', async () => {
    const repository = new LaravelAdRepository(
      'https://api.example.com',
      $fetch
    )

    const ad = await repository.fetchRandom()

    expect(ad.type).toBeDefined()
    expect(ad.id).toBeDefined()
  })
})
```

## 🔄 Migration Path

### Step 1: Create Domain Layer (Low Risk)
1. Create `domain/ads/types.ts`
2. Move type definitions from `RandomAd.vue`
3. Add validation functions
4. Write tests for validators

**Benefits**: Reusable types, testable validation
**Risk**: Low (no breaking changes)

### Step 2: Create Application Layer (Medium Risk)
1. Create port interfaces
2. Create use case classes
3. Write use case tests with mocks

**Benefits**: Testable business logic
**Risk**: Medium (new patterns)

### Step 3: Create Infrastructure Layer (Low Risk)
1. Create repository implementations
2. Create config providers
3. Write integration tests

**Benefits**: Swappable implementations
**Risk**: Low (isolated from UI)

### Step 4: Update Presentation Layer (High Risk)
1. Create composables using use cases
2. Refactor components to use composables
3. Update component tests

**Benefits**: Simplified components
**Risk**: High (touches existing UI)

## 📋 Checklist for Each Layer

### Before Creating a New Domain Entity
- [ ] Is this a core business concept?
- [ ] Does it have no framework dependencies?
- [ ] Can it be tested without mocks?
- [ ] Does it represent business rules?

### Before Creating a New Use Case
- [ ] Is this a high-level business flow?
- [ ] Does it orchestrate domain logic?
- [ ] Can it be tested with mocked ports?
- [ ] Is it framework-agnostic?

### Before Creating Infrastructure Code
- [ ] Does it implement a port interface?
- [ ] Does it handle external concerns?
- [ ] Can it be swapped for another implementation?
- [ ] Is it isolated from business logic?

### Before Creating a Component
- [ ] Is it purely for rendering?
- [ ] Does it delegate logic to composables?
- [ ] Can it be tested with mocked services?
- [ ] Does it avoid business validation?

## 🚀 Quick Start

To implement Clean Architecture in this project:

1. **Read this guide thoroughly**
2. **Review the issue template** at `.github/ISSUE_TEMPLATE/clean-architecture-refactoring.md`
3. **Start with Phase 1** (Domain Layer) - lowest risk
4. **Test at each step** - never move to next phase without tests
5. **Get code reviews** - ensure team understands new patterns
6. **Document decisions** - create ADRs for significant choices

## 📚 Additional Resources

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [TypeScript Result Type](https://imhoff.blog/posts/using-results-in-typescript)

## ❓ FAQ

**Q: Isn't this over-engineering for a small project?**
A: Possibly! Start with Phase 1-2. You can stop at any phase if the complexity isn't worth it.

**Q: How does this work with Nuxt auto-imports?**
A: Composables still use auto-imports. Only domain/application layers avoid framework code.

**Q: What about performance?**
A: Additional abstraction adds negligible overhead. The benefits (testability, maintainability) typically outweigh costs.

**Q: Can I use this pattern incrementally?**
A: Yes! Refactor one feature at a time. Old and new code can coexist during migration.

---

**Last Updated**: 2026-02-04
**Maintainer**: @ijklim
