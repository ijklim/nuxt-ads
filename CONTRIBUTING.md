# Contributing to Nuxt Ads

Thank you for your interest in contributing to Nuxt Ads! This document provides guidelines and standards for contributing to this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Standards](#commit-message-standards)
- [Code Style](#code-style)
- [Testing](#testing)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/nuxt-ads.git`
3. Install dependencies: `pnpm install`
4. Create a branch following our [naming conventions](#branch-naming-conventions)

## Development Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate test coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Build for production
pnpm build
```

## Branch Naming Conventions

When creating a new branch, follow this format:

### Format

```
type/issue-number-short-description
```

### Types

Match the type to your PR title (see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)):

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes

### Examples

```
feat/1-pr-approval-requirement
fix/42-ad-loading-race-condition
docs/15-update-readme
test/23-add-unit-tests
```

### Rules

- Use **lowercase only**
- Use **hyphens** (`-`) to separate words
- **Include the issue number** when applicable
- **No underscores**, trailing slashes, or special characters

## Pull Request Guidelines

### PR Title Format

```
type: brief description (closes/fixes #issue-number)
```

### Examples

```
feat: add pull request approval requirement (fixes #1)
fix: resolve ad loading race condition (closes #42)
docs: update installation instructions (closes #15)
test: add unit tests for RandomAd component (resolves #23)
```

### PR Title Rules

1. **Start with a type** followed immediately by a colon and a space (`type: `)
2. **Use imperative mood** for the description (e.g., "add", "fix", "update")
3. **Keep under 72 characters**
4. **Include issue reference** in parentheses at the end
   - Single issue: `(fixes #N)` or `(closes #N)`
   - Multiple issues: `(resolves #N1, #N2)`
5. **No period** at the end

### PR Body

- Provide a clear description of what changes were made
- Explain **why** the changes were necessary
- Include any relevant context or screenshots
- List any breaking changes
- Mention if documentation needs to be updated

### PR Template

```markdown
## Description

Brief description of the changes

## Related Issue

Closes #<issue-number>

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing

- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots here

## Breaking Changes

List any breaking changes or "None"
```

## Commit Message Standards

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

### Format

```
type: subject

optional body

optional footer
```

### Examples

```
feat: implement dark mode toggle
fix: resolve ad loading race condition
docs: update testing documentation
test: add unit tests for RandomAd component
```

### Rules

- **Start with lowercase** - The subject line should begin with a lowercase letter (e.g., `feat: add feature` not `feat: Add feature`)
- Keep subject line under 72 characters
- Use imperative mood (e.g., "add" not "added" or "adds")
- Separate subject from body with a blank line
- Wrap body at 72 characters
- Use body to explain what and why, not how

### Types

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test changes
- `chore` - Maintenance tasks
- `ci` - CI/CD changes

## Code Style

### General

- Use **Prettier** for code formatting
- Use **two spaces** for indentation
- **Semicolons are required** at the end of statements
- Follow **ESLint** rules configured in the project

### Vue Components

- Use **Composition API** with `<script setup lang="ts">`
- Define **explicit TypeScript interfaces** for all props and emits
- Follow **Nuxt auto-import conventions** (don't manually import composables)
- Use **PascalCase** for component names (e.g., `BaseButton.vue`, `AdDisplay.vue`)

### TypeScript

- Define types for all function parameters and return values
- Use interfaces for object shapes
- Avoid `any` type unless absolutely necessary

### Data Fetching

- **Server-side**: Use `useAsyncData` or `useFetch` composables
- **Client-side**: Only use direct `fetch` within `onMounted` for non-critical data
- **State management**: Use `useState` for global state

## Testing

### Unit Tests

- Use **Vitest** with `globals: true`
- Place tests in `tests/unit/` directory
- Name test files: `ComponentName.test.ts`
- Mock external dependencies using `(globalThis as any)` when necessary
- Always include `beforeEach()` to reset mocks
- Use `async/await` for async tests

### E2E Tests

- Use **Playwright** for E2E tests
- Place tests in `tests/e2e/` directory
- Name test files: `feature-name.spec.ts`
- Test critical user paths

### Test Requirements

- All new features must include unit tests
- Bug fixes should include regression tests
- Maintain or improve code coverage
- All tests must pass before PR approval

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## Maintaining Code Quality

When adding new code:
- Keep all tests passing at 100%
- Follow established architectural patterns (see [ARCHITECTURE.md](./docs/ARCHITECTURE.md))
- Add unit tests before implementing features
- Document APIs using JSDoc comments

When refactoring:
- Maintain strict layer boundaries (Domain → Application → Infrastructure → Presentation)
- Update documentation if interfaces or public APIs change
- Ensure all 51 tests still pass
- Review security implications for any validation changes

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Review documentation: [ARCHITECTURE.md](./docs/ARCHITECTURE.md), [SECURITY.md](./docs/SECURITY.md), [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
3. Create a new issue with your question
4. Reach out to the maintainers

Thank you for contributing to Nuxt Ads! 🎉
