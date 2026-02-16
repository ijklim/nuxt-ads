## Example: Clean / Hexagonal Architecture in this repository

This repo follows a clean (hexagonal) architecture: core domain logic is insulated from framework and I/O details by explicit ports (interfaces) and adapters (infrastructure).

Layers and where to find them
- **Domain (pure business rules):** validation and types live here. See [domain/ads/validators.ts](../domain/ads/validators.ts) and [domain/ads/types.ts](../domain/ads/types.ts). The `Result` pattern is in [domain/shared/result.ts](../domain/shared/result.ts).
- **Application (use-cases + ports):** orchestrates flows and depends only on interfaces. See the `FetchRandomAd` use-case at [application/use-cases/FetchRandomAd.ts](../application/use-cases/FetchRandomAd.ts) and ports like [application/ports/IAdRepository.ts](../application/ports/IAdRepository.ts) and [application/ports/IConfigProvider.ts](../application/ports/IConfigProvider.ts).
- **Infrastructure (adapters):** concrete implementations of ports and framework glue. Example: [infrastructure/repositories/AdRepository.ts](../infrastructure/repositories/AdRepository.ts) and [infrastructure/config/NuxtConfigProvider.ts](../infrastructure/config/NuxtConfigProvider.ts).
- **Framework / UI:** components and composables that call use-cases, e.g. [components/RandomAd.vue](../components/RandomAd.vue) and [composables/useAdController.ts](../composables/useAdController.ts).

How data flows (concise example)
1. A caller (component or server route) asks the application for an ad by calling the use-case `FetchRandomAd` ([application/use-cases/FetchRandomAd.ts](../application/use-cases/FetchRandomAd.ts)).
2. `FetchRandomAd` depends on the `IAdRepository` port ([application/ports/IAdRepository.ts](../application/ports/IAdRepository.ts)) and calls `fetchRandom()`.
3. The concrete adapter `AdRepository` ([infrastructure/repositories/AdRepository.ts](../infrastructure/repositories/AdRepository.ts)) implements `IAdRepository`. It performs I/O (uses Nuxt's `$fetch`) and returns raw JSON.
4. Before returning domain models, `AdRepository` converts raw JSON into domain objects by using the domain validators ([domain/ads/validators.ts](../domain/ads/validators.ts)). Those validators return a `Result` (`isOk` / `isErr`) defined in [domain/shared/result.ts](../domain/shared/result.ts).
5. The use-case receives the `Result` and either forwards the domain object to the caller or propagates an error. Tests assert both success and failure scenarios.

Why this is clean
- Dependencies point inward: domain and application layers do not import Nuxt or `$fetch` — they only depend on interfaces. Concrete adapters live in `infrastructure`.
- Easy to test: domain validators are pure and tested in [tests/unit/domain/validators.test.ts](../tests/unit/domain/validators.test.ts). Infrastructure adapters are tested by mocking the runtime `$fetch` as in [tests/unit/infrastructure/AdRepository.test.ts](../tests/unit/infrastructure/AdRepository.test.ts).
- Small surface for change: to add a new ad type, implement a new validator in `domain/ads/validators.ts` and add tests; minimal changes to adapters or use-cases.

Quick pointers (useful files)
- Domain validators: [domain/ads/validators.ts](../domain/ads/validators.ts)
- Use-case: [application/use-cases/FetchRandomAd.ts](../application/use-cases/FetchRandomAd.ts)
- Ports: [application/ports/IAdRepository.ts](../application/ports/IAdRepository.ts), [application/ports/IConfigProvider.ts](../application/ports/IConfigProvider.ts)
- Infrastructure adapter: [infrastructure/repositories/AdRepository.ts](../infrastructure/repositories/AdRepository.ts)
- Unit tests (domain): [tests/unit/domain/validators.test.ts](../tests/unit/domain/validators.test.ts)
- Unit tests (adapter): [tests/unit/infrastructure/AdRepository.test.ts](../tests/unit/infrastructure/AdRepository.test.ts)

How to extend (example)
1. Add a new ad shape: add parsing/validation logic to `domain/ads/validators.ts` and update domain `types.ts`.
2. Add unit tests for the validator in `tests/unit/domain/`.
3. If the API response changes, adapt `AdRepository` mapping in [infrastructure/repositories/AdRepository.ts](../infrastructure/repositories/AdRepository.ts) and update adapter tests.

This structure keeps core business rules framework-agnostic, improves testability, and makes it straightforward to swap frameworks or run the code in different environments.
