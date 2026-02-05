# Issue Text - Copy This to Create the Phase 1 Sub-Issue

**Instructions:**
1. Go to https://github.com/ijklim/nuxt-ads/issues/new
2. Copy everything below the line
3. Paste into the issue description
4. Add title: `Refactor: Phase 1 - Domain Layer (part of #49)`
5. Add labels: `enhancement`, `architecture`, `refactoring`, `technical-debt`
6. Click "Submit new issue"

---

## Refactor: Phase 1 - Domain Layer (Part of #49)

### Parent Issue
- Tracks: #49

### Goal
Establish the domain layer foundation for the Clean/Hexagonal Architecture refactor. This phase should introduce pure domain types and validation logic with no Nuxt/Vue dependencies.

### Scope
- [ ] Create `domain/ads/types.ts` with discriminated union ad models
- [ ] Create `domain/ads/validators.ts` with validation logic for ad payloads
- [ ] Create `domain/shared/result.ts` for `Result<T, E>` error handling
- [ ] Create `domain/shared/errors.ts` for domain-specific error types
- [ ] Add unit tests for validators (no UI dependencies)

### Acceptance Criteria
- [ ] Domain layer contains no framework dependencies
- [ ] Validators handle required ad types and required fields
- [ ] Unit tests added and pass with `pnpm test`
- [ ] No user-facing behavior changes in this phase

### Notes
- Keep this phase backward compatible with existing components
- Follow existing TypeScript, linting, and formatting rules

---

**Priority:** Low (Foundation work)  
**Risk:** Low  
**Estimated Effort:** 8-10 hours
