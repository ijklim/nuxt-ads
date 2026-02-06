# Clean Architecture: Complete Implementation Guide

## Overview

This document describes the complete Clean/Hexagonal Architecture implementation for the Nuxt Ads project. The refactoring spans 6 phases, with Phases 1-5 focused on core architecture and security, and Phase 6 on documentation and testing completeness.

**Current Status:** ✅ All 6 phases complete

---

## 🏛️ Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER (Phase 4)                 │
│                                                                │
│  ┌──────────────────┐  ┌─────────────────────┐                 │
│  │  Components      │  │  Composables        │                 │
│  │  ├─ RandomAd.vue │  │  ├─ useAdController │ ← Orchestrates  │
│  │  ├─ Amazon/      │  │  └─ useUtility      │   all layers    │
│  │  │  Banner.vue   │  └─────────────────────┘                 │
│  │  ├─ Google/      │                                          │
│  │  │  AdSense.vue  │                                          │
│  │  └─ Mochahost/   │   (Auto-imports, no manual imports)      │
│  │     Banner.vue   │                                          │
│  └──────────────────┘                                          │
│           ▲                                                    │
│           │ renders & calls                                    │
└───────────┼────────────────────────────────────────────────────┘
            │
┌───────────┼───────────────────────────────────────────────────┐
│           │      APPLICATION LAYER (Phase 2)                  │
│           │                                                   │
│      ┌────┴─────────────────┐                                 │
│      │  FetchRandomAdUseCase│ ← Main orchestrator             │
│      └────┬─────────────────┘                                 │
│           │ implements                                        │
│      ┌────┴─────────────────────────────────┐                 │
│      │         PORT INTERFACES              │                 │
│      │ ┌─────────────────────────────────┐  │                 │
│      │ │ IAdRepository                   │  │                 │
│      │ │ - fetchRandom(filters)          │  │                 │
│      │ └─────────────────────────────────┘  │                 │
│      │ ┌─────────────────────────────────┐  │                 │
│      │ │ IConfigProvider                 │  │                 │
│      │ │ - getAdsServerUrl()             │  │                 │
│      │ │ - getAdClient()                 │  │                 │
│      │ └─────────────────────────────────┘  │                 │
│      └────┬─────────────────────────────────┘                 │
│           │ depends on                                        │
└───────────┼───────────────────────────────────────────────────┘
            │
┌───────────┼──────────────────────────────────────────────────┐
│           │    INFRASTRUCTURE LAYER (Phase 3 & 5)            │
│           │                                                  │
│      ┌────┴────────────────────────────────┐                 │
│      │   ADAPTER IMPLEMENTATIONS           │                 │
│      │ ┌─────────────────────────────────┐ │                 │
│      │ │ AdRepository                    │ │                 │
│      │ │ implements IAdRepository        │ │                 │
│      │ │ - Calls Laravel API via $fetch  │ │                 │
│      │ │ - Normalizes API responses      │ │                 │
│      │ │ - Maps to Domain objects        │ │                 │
│      │ └─────────────────────────────────┘ │                 │
│      │ ┌─────────────────────────────────┐ │                 │
│      │ │ NuxtConfigProvider              │ │                 │
│      │ │ implements IConfigProvider      │ │                 │
│      │ │ - Wraps Nuxt runtime config     │ │                 │
│      │ └─────────────────────────────────┘ │                 │
│      │ ┌─────────────────────────────────┐ │                 │
│      │ │ Security Validators (Phase 5)   │ │                 │
│      │ │ - validateQueryParameters()     │ │                 │
│      │ │ - validateRuntimeConfig()       │ │                 │
│      │ └─────────────────────────────────┘ │                 │
│      │ ┌─────────────────────────────────┐ │                 │
│      │ │ Safe Messaging (Phase 5)        │ │                 │
│      │ │ - validateMessageEvent()        │ │                 │
│      │ │ - sendSafeMessage()             │ │                 │
│      │ └─────────────────────────────────┘ │                 │
│      └────┬────────────────────────────────┘                 │
│           │ uses                                             │
└───────────┼──────────────────────────────────────────────────┘
            │
┌───────────┼──────────────────────────────────────────────────┐
│           │       DOMAIN LAYER (Phase 1)                     │
│           │  (Pure Business Logic - No Framework Deps)       │
│           │                                                  │
│      ┌────┴────────────────────────────────┐                 │
│      │        AD ENTITIES & RULES          │                 │
│      │ ┌─────────────────────────────────┐ │                 │
│      │ │ Ad Types (Discriminated Unions) │ │                 │
│      │ │ - GoogleAdSense                 │ │                 │
│      │ │ - AmazonBanner                  │ │                 │
│      │ │ - ImageAd                       │ │                 │
│      │ └─────────────────────────────────┘ │                 │
│      │ ┌─────────────────────────────────┐ │                 │
│      │ │ Validators                      │ │                 │
│      │ │ - validateAd()                  │ │                 │
│      │ │ - validateQueryParams()         │ │                 │
│      │ │ - validateConfig()              │ │                 │
│      │ └─────────────────────────────────┘ │                 │
│      │ ┌─────────────────────────────────┐ │                 │
│      │ │ Shared Utilities                │ │                 │
│      │ │ - Result<T, E> pattern          │ │                 │
│      │ │ - ValidationError               │ │                 │
│      │ │ - CustomError types             │ │                 │
│      │ └─────────────────────────────────┘ │                 │
│      └─────────────────────────────────────┘                 │
│                                                              │
│     (No imports from outer layers allowed)                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 📋 Dependency Rules

The fundamental rule of Clean Architecture:

**Dependencies always point inward.**

✅ ALLOWED patterns:
- Presentation → Application → Domain
- Infrastructure → Application → Domain
- Infrastructure → Domain

❌ NEVER allow:
- Domain → Application
- Domain → Infrastructure
- Application → Presentation (one-way only)
```

---

## 🔀 6-Phase Refactoring Journey

### Phase 1: Domain Layer ✅

**Goal:** Establish pure business logic layer

**Created:**
- `domain/ads/types.ts` - Ad entity types (discriminated unions)
- `domain/ads/validators.ts` - Validation rules for ads
- `domain/shared/result.ts` - Result<T, E> error handling pattern
- `domain/shared/errors.ts` - Domain-specific error types

**Key Principles:**
- Zero framework dependencies
- Pure TypeScript business logic
- Explicit error handling with Result pattern
- Type-safe discriminated unions for Ad types

**Test Coverage:** ✅ Covered by unit tests

---

### Phase 2: Application Layer ✅

**Goal:** Define use cases and port interfaces

**Created:**
- `application/use-cases/FetchRandomAd.ts` - Main use case orchestrator
- `application/ports/IAdRepository.ts` - Interface for data access
- `application/ports/IConfigProvider.ts` - Interface for configuration

**Key Principles:**
- Interfaces define contracts
- Use cases coordinate dependencies
- No concrete implementations
- Dependency injection ready

**Test Coverage:** ✅ Covered by unit tests

Port interfaces (`IAdRepository`, `IConfigProvider`) are defined in the `application/ports/` directory. Unit tests validate the use case behavior.

---

### Phase 3: Infrastructure Layer ✅

**Goal:** Implement external adapters

**Created:**
- `infrastructure/repositories/AdRepository.ts` - Laravel API implementation
- `infrastructure/config/NuxtConfigProvider.ts` - Nuxt config wrapper
- API response normalization (MochahostBanner → Mochahost)

**Key Principles:**
- Implements interfaces from Application layer
- Handles external concerns (HTTP, config)
- Maps external data to Domain entities
- Tested with mocked HTTP calls

**Test Coverage:** ✅ Covered by unit tests

Adapter implementations (`AdRepository` for API integration, `NuxtConfigProvider` for configuration) are located in the `infrastructure/` layer. Unit tests validate adapters with mocked HTTP calls.

---

### Phase 4: Presentation Layer ✅

**Goal:** Integrate architecture into Vue components

**Created/Updated:**
- `composables/useAdController.ts` - Presentation controller
- `components/RandomAd.vue` - Main ad component (refactored)
- Updated test suite with proper mocking

**Key Principles:**
- Composables orchestrate use cases
- Components stay thin (UI only)
- Dependency injection via constructor
- Clean separation of concerns

**Test Coverage:** ✅ Covered by unit tests

The presentation controller (`useAdController` composable) orchestrates use cases, while the main component (`RandomAd.vue`) handles UI rendering. Unit tests validate the component behavior with mocked dependencies.

---

### Phase 5: Security & Best Practices ✅

**Goal:** Harden security and add protective measures

**Created:**
- `infrastructure/security/validators.ts` - Parameter & config validation
- `infrastructure/security/messaging.ts` - Safe postMessage API
- Comprehensive security tests (13 tests)

**Key Security Measures:**

1. **Parameter Whitelisting**
   - Only allowed query params pass through
   - DOS protection (100-char limit)
   - Type validation

2. **Config Validation**
   - Required env variables checked
   - URL format validation
   - Client ID non-empty check

3. **Safe Messaging**
   - Origin-based validation (no `*` wildcard)
   - Message structure validation
   - Type field required

**Test Coverage:** ✅ Covered by unit tests

For security implementation, see [validators.ts](../infrastructure/security/validators.ts) for input validation and [messaging.ts](../infrastructure/security/messaging.ts) for safe messaging. Tests are located in [tests/unit/infrastructure/security.test.ts](../tests/unit/infrastructure/security.test.ts) and [tests/unit/infrastructure/messaging.test.ts](../tests/unit/infrastructure/messaging.test.ts).

---

### Phase 6: Documentation & Testing ✅

**Goal:** Document architecture and validate test coverage

**Created:**
- `docs/ARCHITECTURE.md` (this file) - Complete architecture reference
- `docs/SECURITY.md` - Security practices and threat models
- `docs/API_DOCUMENTATION.md` - Public API reference with JSDoc
- Test coverage analysis

**Key Achievements:**
- ✅ Unit tests passing
- ✅ Test suites covering all layers
- ✅ Comprehensive JSDoc comments on public APIs
- ✅ Architecture decision records documented
- ✅ Security threat models documented

---

## 📁 Final Directory Structure

```
nuxt-ads/
├── domain/                          # Layer 1: Pure business logic
│   ├── ads/
│   │   ├── types.ts                 # Ad entity discriminated unions
│   │   └── validators.ts            # Validation rules
│   └── shared/
│       ├── result.ts                # Result<T, E> error handling
│       └── errors.ts                # Domain error types
│
├── application/                     # Layer 2: Use cases & interfaces
│   ├── ports/
│   │   ├── IAdRepository.ts         # Data access interface
│   │   └── IConfigProvider.ts       # Configuration interface
│   └── use-cases/
│       └── FetchRandomAd.ts         # Main orchestrator
│
├── infrastructure/                  # Layer 3: External adapters
│   ├── repositories/
│   │   └── AdRepository.ts          # Laravel API adapter
│   ├── config/
│   │   └── NuxtConfigProvider.ts    # Nuxt config adapter
│   └── security/                    # Phase 5: Security module
│       ├── validators.ts            # Parameter & config validation
│       └── messaging.ts             # Safe postMessage API
│
├── composables/                     # Presentation glue layer
│   └── useAdController.ts           # Vue composable controller
│
├── components/                      # Layer 4: Vue components
│   ├── RandomAd.vue                 # Main ad display
│   ├── Amazon/
│   │   └── Banner.vue               # Amazon ad format
│   ├── Google/
│   │   └── AdSense.vue              # Google AdSense format
│   └── Mochahost/
│       └── Banner.vue               # Image ad format
│
├── tests/
│   └── unit/
│       ├── domain/
│       │   └── validators.test.ts    # Domain layer tests
│       ├── application/
│       │   └── FetchRandomAd.test.ts # Use case tests
│       ├── infrastructure/
│       │   ├── AdRepository.test.ts  # Repository tests
│       │   ├── security.test.ts      # Security validator tests
│       │   └── messaging.test.ts     # Safe messaging tests
│       └── RandomAd.test.ts          # Component tests
│
└── docs/
    ├── ARCHITECTURE.md              # This file
    ├── SECURITY.md                  # Security documentation
    └── API_DOCUMENTATION.md         # Public API reference
```

---

## 🧪 Test Coverage Summary

| Layer | Module | Status |
|-------|--------|--------|
| Domain | Validators | ✅ Covered |
| Application | FetchRandomAd | ✅ Covered |
| Infrastructure | AdRepository | ✅ Covered |
| Infrastructure | Security Validators | ✅ Covered |
| Infrastructure | Safe Messaging | ✅ Covered |
| Presentation | RandomAd Component | ✅ Covered |
| **Total** | **All Test Suites** | **✅ Covered** |

---

## 🔐 Security Measures Implemented (Phase 5)

### Query Parameter Protection
- ✅ Whitelist-based validation
- ✅ Length limits (DOS prevention)
- ✅ Type checking
- ✅ Whitespace trimming

### Configuration Validation
- ✅ Required fields enforcement
- ✅ URL format validation
- ✅ Empty value rejection

### Safe Messaging (postMessage)
- ✅ Origin-based validation (no wildcards)
- ✅ Message structure validation
- ✅ Type field requirement
- ✅ Error handling with logging

---

## 📚 Key Design Patterns

### 1. Result Pattern (Error Handling)

Explicit, composable error handling without exceptions in business logic. See [domain/shared/result.ts](../domain/shared/result.ts) for implementation and [tests/unit/domain/validators.test.ts](../tests/unit/domain/validators.test.ts) for usage examples.

### 2. Discriminated Unions (Type Safety)

Type-safe discriminated unions for ad variants ensuring exhaustive pattern matching. See [domain/ads/types.ts](../domain/ads/types.ts) for type definitions and [tests/unit/domain/validators.test.ts](../tests/unit/domain/validators.test.ts) for pattern matching examples.

### 3. Dependency Injection

Decoupled, testable components through dependency injection. See [application/use-cases/FetchRandomAd.ts](../application/use-cases/FetchRandomAd.ts) and [composables/useAdController.ts](../composables/useAdController.ts) for patterns.

### 4. Port & Adapter Pattern

Interfaces defined in the application layer with implementations in the infrastructure layer. See [application/ports/](../application/ports/) for port interfaces and [infrastructure/repositories/](../infrastructure/repositories/) and [infrastructure/config/](../infrastructure/config/) for implementations.

**Benefit:** Framework-agnostic business logic, easy to swap implementations.

---

## 🚀 Benefits Achieved

| Benefit | How Implemented |
|---------|-----------------|
| **Testability** | Pure domain logic, mocked adapters, isolated layers |
| **Maintainability** | Single responsibility per layer, clear boundaries |
| **Scalability** | Easy to add new ad types, repositories, use cases |
| **Security** | Input validation, safe messaging, config checks |
| **Framework Independence** | Domain layer has zero framework dependencies |
| **Team Onboarding** | Clear architecture, well-documented layers |

---

## 📖 Next Steps for Maintenance

### Adding New Features
1. **New Ad Type?** Add to `domain/ads/types.ts`
2. **New Data Source?** Create adapter implementing `IAdRepository`
3. **New Business Rule?** Add validator to `domain/ads/validators.ts`
4. **New Configuration?** Extend `IConfigProvider` interface

### Debugging Issues
1. **UI Problem?** Check `components/RandomAd.vue` and `composables/useAdController.ts`
2. **API Problem?** Check `infrastructure/repositories/AdRepository.ts`
3. **Business Logic?** Check `domain/ads/validators.ts` and `application/use-cases/`
4. **Security?** Check `infrastructure/security/` validators and messaging

### Testing Changes

Run the full test suite:
- `pnpm test` - Execute all tests
- `pnpm test:watch` - Watch mode for development
- `pnpm test:coverage` - Generate coverage report

See [tests/](../tests/) directory for test files organized by layer. All tests must pass before committing changes.

---

## 🎓 Learning Resources

- [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) - The foundational book
- [Hexagonal Architecture](https://www.thegildedage.dev/posts/your-code-is-broken-hexagonal-architecture/) - Clear explanation with examples
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/) - Deep dive into domain modeling

---

## 📝 Architecture Decision Records (ADRs)

### ADR-001: Discriminated Unions for Ad Types
**Decision:** Use TypeScript discriminated unions instead of inheritance or enums

**Rationale:**
- Type-safe pattern matching
- Exhaustive checking at compile time
- Easy to extend with new ad types

**Status:** ✅ Implemented

---

### ADR-002: Result<T, E> Pattern
**Decision:** Use Result pattern instead of exceptions in domain layer

**Rationale:**
- Explicit error handling
- Composable operations
- Aligns with functional programming principles

**Status:** ✅ Implemented

---

### ADR-003: Port & Adapter for Repositories
**Decision:** Define repository interface in application layer, implement in infrastructure

**Rationale:**
- Framework independence
- Easy testing with mocks
- Ability to swap implementations

**Status:** ✅ Implemented

---

### ADR-004: Parameter Whitelisting (Phase 5)
**Decision:** Validate query parameters against whitelist instead of blacklist

**Rationale:**
- More secure (fail-closed vs fail-open)
- Clear intent about allowed parameters
- DOS protection with length limits

**Status:** ✅ Implemented

---

### ADR-005: Origin-Based Message Validation (Phase 5)
**Decision:** Use strict origin checking in postMessage API, no wildcard

**Rationale:**
- Prevents message injection attacks
- Explicit allowed origins
- Secure-by-default

**Status:** ✅ Implemented

---

## 🎯 Conclusion

The Nuxt Ads application now implements a robust, production-ready Clean Architecture across 6 phases:

1. ✅ **Domain Layer** - Pure business logic
2. ✅ **Application Layer** - Use cases and interfaces
3. ✅ **Infrastructure Layer** - External adapters
4. ✅ **Presentation Layer** - Vue components
5. ✅ **Security Layer** - Validation and safe messaging
6. ✅ **Documentation** - Complete guides and API docs

All unit tests pass, demonstrating a solid foundation for future development and maintenance.
