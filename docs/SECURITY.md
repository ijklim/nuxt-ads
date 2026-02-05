# Security Documentation

## Overview

This document outlines the security architecture, threat models, and protective measures implemented in the Nuxt Ads application. **For implementation details, see the actual source code files and their comprehensive test suites.**

---

## 🛡️ Security Layers

### Layer 1: Input Validation (Query Parameters)

**Threat Model:**
- Parameter injection attacks
- Denial of Service (DOS) via oversized values
- Unexpected behavior from unvalidated inputs

**Implementation:** [infrastructure/security/validators.ts](../infrastructure/security/validators.ts) - `validateQueryParameters()`

**Strategy:**
Whitelist-based validation with length limits and type checking.

**Whitelist:**
- `at` - Location/page identifier
- `pk` - Publisher key
- `random` - Randomization flag
- `category` - Ad category filter
- `sb` - Shuffle button flag

**Validation Rules:**

| Check | Implementation | Reason |
|-------|----------------|--------|
| Whitelist | Only allowed params pass | Prevents injection attacks |
| Type | Must be string | Prevents type coercion attacks |
| Length | Max 100 chars | DOS prevention |
| Whitespace | Trimmed | Prevents bypass attempts |

**Test Coverage:** [tests/unit/infrastructure/security.test.ts](../tests/unit/infrastructure/security.test.ts)
- ✅ Allows whitelisted parameters
- ✅ Rejects non-whitelisted parameters
- ✅ Rejects empty or whitespace values
- ✅ Rejects extremely long values (DOS)
- ✅ Handles empty filters object
- ✅ Trims whitespace from values

---

### Layer 2: Configuration Validation

**Threat Model:**
- Missing required credentials
- Invalid configuration causing unexpected behavior
- Exposure to misconfigured endpoints

**Implementation:** [infrastructure/security/validators.ts](../infrastructure/security/validators.ts) - `validateRuntimeConfig()`

**Strategy:**
Strict validation of required configuration at startup.

**Validation Rules:**

| Check | Requirement | Reason |
|-------|-------------|--------|
| adsServer present | Required | No fallback API endpoint allowed |
| adClient present | Required | No anonymous ad serving |
| URL format | Valid URL | Prevents malformed endpoints |
| Non-empty values | Required | Prevents misconfiguration |

**Test Coverage:** [tests/unit/infrastructure/security.test.ts](../tests/unit/infrastructure/security.test.ts)
- ✅ Accepts valid configuration
- ✅ Rejects missing adsServer
- ✅ Rejects missing adClient
- ✅ Rejects invalid URL format
- ✅ Rejects empty adClient

---

### Layer 3: Safe Message API (postMessage)

**Module:** [infrastructure/security/messaging.ts](../infrastructure/security/messaging.ts)

**Threat Model:**
- Message injection from malicious origins
- Cross-site scripting (XSS) via iframe messages
- Data leakage to unauthorized frames

**Implementation:**

The safe messaging API provides origin-validated `postMessage` communication with three key protections:
1. **Origin Validation** - Explicit whitelist, no wildcard `*`
2. **Structure Validation** - Messages must have required `type` field
3. **Fail-Closed** - Invalid messages rejected immediately

For implementation details and sender/receiver patterns, see [messaging.ts](../infrastructure/security/messaging.ts).

**Key Security Features:**

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| Origin checking | Explicit list, no `*` | Prevents message injection |
| Fail-closed | Reject on any validation error | Secure by default |
| Type enforcement | Required `type` field | Clear message intent |
| No broadcast | Target parent window only | Limits exposure |
| Error handling | Try-catch with logging | Prevents crashes |

**Test Coverage:** 7 tests
- ✅ Accepts message from same origin
- ✅ Rejects message from different origin
- ✅ Rejects message with invalid structure
- ✅ Rejects message without type
- ✅ Accepts custom allowed origins
- ✅ Sends message to parent window
- ✅ Handles postMessage errors gracefully

---

## 🔒 Security Best Practices

### 1. Environment Variable Management

**Do:** Load from runtime config at build time

**Why:** Environment variables set at build time ensure secrets never leak to version control. See [NuxtConfigProvider.ts](../infrastructure/config/NuxtConfigProvider.ts) for the implementation.

---

### 2. URL Construction

**Do:** Use URL constructor for safe URL building with automatic parameter encoding

**Why:** URL constructor prevents injection attacks by automatically encoding parameters. See [AdRepository.ts](../infrastructure/repositories/AdRepository.ts#L30-L35) for safe URL construction example.

---

### 3. Message Communication

**Do:** Use safe messaging API with origin validation via [sendSafeMessage()](../infrastructure/security/messaging.ts)

**Why:** Wildcard origins allow any origin to intercept messages. Explicit origin checking is required. See [messaging.ts](../infrastructure/security/messaging.ts) for implementation and [messaging.test.ts](../tests/unit/infrastructure/messaging.test.ts) for usage examples.

---

### 4. Error Handling

**Do:** Log errors for debugging but never expose system details to end users

**Why:** Error details help attackers understand your system. See [useAdController.ts](../composables/useAdController.ts) for safe error handling patterns and [RandomAd.test.ts](../tests/unit/components/RandomAd.test.ts) for error handling tests.

---

### 5. Data Validation

**Do:** Validate all external data before processing via [validateQueryParameters()](../infrastructure/security/validators.ts)

**Why:** All external data (user input, API responses) can be malicious. See [security.test.ts](../tests/unit/infrastructure/security.test.ts) for validation test examples and [validators.ts](../infrastructure/security/validators.ts) for implementation.

---

## 🚨 Threat Mitigation Matrix

| Threat | Layer | Mitigation | Status |
|--------|-------|-----------|--------|
| **Parameter Injection** | Input Validation | Whitelist-based filtering | ✅ Implemented |
| **DOS via Large Input** | Input Validation | 100-char length limit | ✅ Implemented |
| **Missing Config** | Config Validation | Required field checks | ✅ Implemented |
| **Invalid URLs** | Config Validation | URL format validation | ✅ Implemented |
| **Message Injection** | Safe Messaging | Origin-based validation | ✅ Implemented |
| **Wildcard postMessage** | Safe Messaging | Explicit origin required | ✅ Implemented |
| **Malformed Messages** | Safe Messaging | Structure validation | ✅ Implemented |
| **Missing Secrets** | Environment | Build-time config injection | ✅ Implemented |
| **API Key Exposure** | Development | Keys in GitHub Secrets, not .env | ✅ Implemented |
| **Unhandled Errors** | Error Handling | Try-catch with logging | ✅ Implemented |

---

## 🔍 Security Testing

### Unit Tests

### Running Tests

Security tests are automatically included in the main test suite:
- `pnpm test` - Run all tests including security tests
- `pnpm test tests/unit/infrastructure/security.test.ts` - Input & config validation (6 tests)
- `pnpm test tests/unit/infrastructure/messaging.test.ts` - Safe messaging (7 tests)

Security-specific test files:
- [tests/unit/infrastructure/security.test.ts](../tests/unit/infrastructure/security.test.ts) - Input & config validation (6 tests)
- [tests/unit/infrastructure/messaging.test.ts](../tests/unit/infrastructure/messaging.test.ts) - Safe messaging (7 tests)

All 13 security tests must pass before deployment.

### Manual Testing Checklist

**Query Parameters:**
- [ ] Valid params pass validation
- [ ] Invalid params are rejected
- [ ] Long values (>100 chars) are rejected
- [ ] Whitespace is trimmed

**Configuration:**
- [ ] Missing `adsServer` is caught
- [ ] Missing `adClient` is caught
- [ ] Invalid URL is rejected
- [ ] Empty values are rejected

**Message API:**
- [ ] Same-origin messages are accepted
- [ ] Different-origin messages are rejected
- [ ] Messages without `type` field are rejected
- [ ] Malformed messages are rejected

---

## 📋 Security Checklist for Contributors

Before committing code, verify:

- [ ] **No secrets in code** - Check for API keys, tokens, credentials
- [ ] **Input validated** - Query params, config, API responses checked
- [ ] **Errors handled** - Try-catch blocks with appropriate logging
- [ ] **Messages safe** - Using `sendSafeMessage` instead of `postMessage('*')`
- [ ] **URLs validated** - Using `new URL()` constructor
- [ ] **Tests passing** - All security tests pass
- [ ] **No console logs** - Sensitive data not logged

---

## 🚀 Deployment Security

### GitHub Secrets Setup

Required secrets for deployment:
```
NUXT_PUBLIC_ADS_SERVER  → Backend API URL
NUXT_PUBLIC_AD_CLIENT   → Google AdSense Publisher ID
SSH_HOST                → Server hostname
SSH_USERNAME            → SSH username
SSH_KEY                 → SSH private key
SSH_PORT                → SSH port (usually 22)
SSH_DEPLOY_PATH         → Deployment directory path
```

### Production Checklist

- [ ] All GitHub Secrets configured
- [ ] No `.env` file committed to repo
- [ ] Build-time environment variables set
- [ ] HTTPS enforced on all connections
- [ ] CORS headers properly configured
- [ ] postMessage origins validated
- [ ] Security tests passing on CI/CD

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall architecture
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Public API reference
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

---

## 📞 Security Issues

If you discover a security vulnerability, **do not open a public issue**. Instead, email the maintainers with details.

**What to include:**
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (optional)

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [postMessage Security](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [URL Encoding](https://en.wikipedia.org/wiki/Percent-encoding)

---

**Last Updated:** February 5, 2026
**Status:** Phase 5 & 6 Complete
