# Public API Documentation

## Overview

This document provides reference documentation for all public APIs in the Nuxt Ads application, organized by layer and module. **For working code examples, see the test files and source implementations.**

---

## 📦 Domain Layer APIs

### `domain/ads/types.ts`

Type definitions for the core ad entity.

**Implementation:** [domain/ads/types.ts](../domain/ads/types.ts)

#### `Ad` (Discriminated Union)

Union type: `GoogleAdSense | AmazonBanner | ImageAd`

Use the `type` field to narrow to specific variants. Supports exhaustive pattern matching.

#### `GoogleAdSense`

Google AdSense format with slot and layout configuration.

**Key Fields:** `type`, `slot`, `layoutKey`, `format`

#### `AmazonBanner`

Amazon affiliate product with image and pricing.

**Key Fields:** `type`, `href`, `imageUrl`, `price`, `height`, `width`

#### `ImageAd`

Generic image-based ad with link.

**Key Fields:** `type`, `href`, `imageUrl`, `height`, `width`

---

### `domain/ads/validators.ts`

Validation logic for ad domain rules.

**Implementation:** [domain/ads/validators.ts](../domain/ads/validators.ts)

#### `validateAd(data: unknown): Result<Ad, ValidationError>`

Validates raw ad data and returns typed `Ad` or error.

**Test Examples:** [tests/unit/domain/validators.test.ts](../tests/unit/domain/validators.test.ts)

---

### `domain/shared/result.ts`

Functional error handling pattern.

**Implementation:** [domain/shared/result.ts](../domain/shared/result.ts)

#### `Result<T, E>`

Discriminated union for explicit error handling.

- Success: `{ isOk: true; value: T }`
- Error: `{ isErr: true; error: E }`

**Test Examples:** [tests/unit/domain/validators.test.ts](../tests/unit/domain/validators.test.ts)

---

### `domain/shared/errors.ts`

Domain-specific error types.

**Implementation:** [domain/shared/errors.ts](../domain/shared/errors.ts)

#### `ValidationError`

Thrown when data validation fails.

---

## 🎯 Application Layer APIs

### `application/use-cases/FetchRandomAd.ts`

Main use case for fetching random ads.

**Implementation:** [application/use-cases/FetchRandomAd.ts](../application/use-cases/FetchRandomAd.ts)

#### `FetchRandomAdUseCase`

Orchestrates ad fetching with repository and validation.

**Methods:**
- `constructor(repository: IAdRepository)`
- `async execute(filters?: Record<string, string>): Promise<Result<Ad, Error>>`

**Test Examples:** [tests/unit/application/FetchRandomAd.test.ts](../tests/unit/application/FetchRandomAd.test.ts)

---

### `application/ports/IAdRepository.ts`

Port (interface) for ad data access.

**Implementation:** [application/ports/IAdRepository.ts](../application/ports/IAdRepository.ts)

#### `IAdRepository`

**Methods:**
- `fetchRandom(filters?: Record<string, string>): Promise<Result<Ad, Error>>`

**Implementations:**
- [infrastructure/repositories/AdRepository.ts](../infrastructure/repositories/AdRepository.ts)

---

### `application/ports/IConfigProvider.ts`

Port (interface) for configuration access.

**Implementation:** [application/ports/IConfigProvider.ts](../application/ports/IConfigProvider.ts)

#### `IConfigProvider`

**Methods:**
- `getAdsServerUrl(): string`
- `getAdClient(): string`

**Implementations:**
- [infrastructure/config/NuxtConfigProvider.ts](../infrastructure/config/NuxtConfigProvider.ts)

---

## 🔌 Infrastructure Layer APIs

### `infrastructure/repositories/AdRepository.ts`

Adapter for Laravel backend API.

**Implementation:** [infrastructure/repositories/AdRepository.ts](../infrastructure/repositories/AdRepository.ts)

#### `AdRepository` (implements `IAdRepository`)

**Constructor:** `new AdRepository(configProvider: IConfigProvider)`

**Features:**
- ✅ Automatic API response validation
- ✅ Type normalization (MochahostBanner → Mochahost)
- ✅ Error handling with Result pattern
- ✅ Query parameter support

**Test Examples:** [tests/unit/infrastructure/AdRepository.test.ts](../tests/unit/infrastructure/AdRepository.test.ts)

---

### `infrastructure/config/NuxtConfigProvider.ts`

Adapter for Nuxt runtime configuration.

**Implementation:** [infrastructure/config/NuxtConfigProvider.ts](../infrastructure/config/NuxtConfigProvider.ts)

#### `NuxtConfigProvider` (implements `IConfigProvider`)

Reads from Nuxt runtime config (`NUXT_PUBLIC_ADS_SERVER`, `NUXT_PUBLIC_AD_CLIENT`).

---

### `infrastructure/security/validators.ts`

Security validators for parameters and configuration.

**Implementation:** [infrastructure/security/validators.ts](../infrastructure/security/validators.ts)

#### `validateQueryParameters(filters: Record<string, string>): Result<Record<string, string>, ValidationError>`

Validates query parameters against whitelist.

**Whitelist:** `at`, `pk`, `random`, `category`, `sb`

**Validation:**
- Whitelist check (not in set = rejected)
- Type check (must be string)
- Length check (max 100 chars, DOS protection)
- Whitespace trimming

**Test Examples:** [tests/unit/infrastructure/security.test.ts](../tests/unit/infrastructure/security.test.ts)

#### `validateRuntimeConfig(config: { adsServer?: string; adClient?: string }): Result<void, ValidationError>`

Validates runtime configuration on startup.

**Validation:**
- Both `adsServer` and `adClient` required
- `adsServer` must be valid URL
- `adClient` must be non-empty string

**Test Examples:** [tests/unit/infrastructure/security.test.ts](../tests/unit/infrastructure/security.test.ts)

---

### `infrastructure/security/messaging.ts`

Safe postMessage API for iframe communication.

**Implementation:** [infrastructure/security/messaging.ts](../infrastructure/security/messaging.ts)

#### `SafeMessage`

Interface with required `type` field: `{ type: string; [key: string]: any }`

#### `validateMessageEvent(event: MessageEvent, allowedOrigins?: string[]): SafeMessage | null`

Validates incoming postMessage events.

**Security Checks:**
- ✅ Origin validation (explicit list, no wildcards)
- ✅ Structure validation (must be object)
- ✅ Type field requirement
- ✅ Fail-closed approach

**Test Examples:** [tests/unit/infrastructure/messaging.test.ts](../tests/unit/infrastructure/messaging.test.ts)

#### `sendSafeMessage(message: SafeMessage, targetOrigin?: string): void`

Safely sends postMessage to parent window.

**Security Features:**
- ✅ Message validation before sending
- ✅ Configurable target origin (defaults to current origin)
- ✅ Error handling with logging
- ✅ No message broadcast (parent only)

**Test Examples:** [tests/unit/infrastructure/messaging.test.ts](../tests/unit/infrastructure/messaging.test.ts)

---

## 🎨 Presentation Layer APIs

### `composables/useAdController.ts`

Vue composable controller for presentation logic.

**Implementation:** [composables/useAdController.ts](../composables/useAdController.ts)

#### `useAdController(): { isLoading, ad, error, fetchAd }`

Reactive composable that orchestrates use cases for Vue components.

**Returned Properties:**
- `isLoading: Ref<boolean>` - Loading state
- `ad: Ref<Ad | null>` - Current ad or null
- `error: Ref<Error | null>` - Error object or null
- `fetchAd: (filters?: Record<string, string>) => Promise<void>` - Fetch function

**Features:**
- ✅ Automatic query parameter validation (Phase 5)
- ✅ Configuration validation on first use (Phase 5)
- ✅ Dependency injection for testability
- ✅ Comprehensive error handling
- ✅ Result pattern for explicit error handling

**Test Examples:** [tests/unit/RandomAd.test.ts](../tests/unit/RandomAd.test.ts)

---

### `components/RandomAd.vue`

Main ad display component.

**Implementation:** [components/RandomAd.vue](../components/RandomAd.vue)

#### Features
- ✅ Renders different ad types (GoogleAdSense, AmazonBanner, ImageAd)
- ✅ Shows shuffle button when `sb=1` query param present
- ✅ Auto-calculates image dimensions and resizes parent iframe
- ✅ Validates all query parameters (Phase 5)
- ✅ Uses safe messaging API (Phase 5)
- ✅ Shows loading indicator during fetch

#### Usage (Embedding Script)

Developers embed ads via `ads.js` script - no direct component usage needed.

**Test Examples:** [tests/unit/RandomAd.test.ts](../tests/unit/RandomAd.test.ts)

---

## 🔗 Type Relationships

```
Domain Layer (Pure)
├── Ad (discriminated union)
├── ValidationError
└── Result<T, E>

        ↑ depends on
        │
Application Layer (Orchestration)
├── FetchRandomAdUseCase
├── IAdRepository
└── IConfigProvider

        ↑ implements
        │
Infrastructure Layer (Adapters)
├── AdRepository
├── NuxtConfigProvider
├── validateQueryParameters()
├── validateRuntimeConfig()
├── validateMessageEvent()
└── sendSafeMessage()

        ↑ uses
        │
Presentation Layer (UI)
├── useAdController() (composable)
└── RandomAd.vue (component)
```

---

## 📖 Quick Reference

### Fetching Ads

See [tests/unit/RandomAd.test.ts](../tests/unit/RandomAd.test.ts) for complete working examples.

**Key Steps:**
1. Use `useAdController()` composable in Vue component
2. Call `fetchAd(filters)` with optional query parameters
3. Check `ad.value` for result or `error.value` for errors

### Validating Parameters

See [tests/unit/infrastructure/security.test.ts](../tests/unit/infrastructure/security.test.ts) for working examples.

**Key Steps:**
1. Call `validateQueryParameters(filters)`
2. Check `isOk` or `isErr` on result
3. Use validated `value` if successful

### Safe Messaging

See [tests/unit/infrastructure/messaging.test.ts](../tests/unit/infrastructure/messaging.test.ts) for working examples.

**Key Steps:**
1. Import `sendSafeMessage` or `validateMessageEvent`
2. Create message with required `type` field
3. Send/validate with appropriate function

---

## 🧪 Testing

All public APIs have comprehensive unit tests. Run the full test suite:

- `pnpm test` - Execute all tests
- `pnpm test tests/unit/domain/` - Domain layer tests
- `pnpm test tests/unit/application/` - Application layer tests
- `pnpm test tests/unit/infrastructure/` - Infrastructure layer tests
- `pnpm test tests/unit/components/` - Component tests

**Test Coverage:** 51 tests (100% passing)
- Domain: 7 tests
- Application: 2 tests
- Infrastructure: 18 tests
- Components & Composables: 18 tests
- Security: 6 tests
- Infrastructure (Repository): 5 tests
- Infrastructure (Security): 6 tests
- Infrastructure (Messaging): 7 tests
- Presentation: 18 tests

---

## 📚 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall architecture and design patterns
- [SECURITY.md](./SECURITY.md) - Security best practices and threat models

---

**Last Updated:** February 5, 2026
**Status:** Complete (Refactored Option A - No Code Duplication)
