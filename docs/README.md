# Documentation Index

This directory contains comprehensive guides for the Nuxt Ads project architecture and refactoring plans.

## 📚 Available Guides

### 🏗️ [Clean Architecture Implementation Guide](./CLEAN_ARCHITECTURE_GUIDE.md)
**Purpose**: Detailed guide for implementing Clean/Hexagonal Architecture in this project.

**Contents**:
- Architecture overview with visual diagrams
- Layer-by-layer breakdown (Domain, Application, Infrastructure, Presentation)
- Code examples for each layer
- Testing strategies
- Migration path with risk assessment
- FAQs and best practices

**Who should read**: Developers implementing the refactoring

---

### 📝 [How to Create Refactoring Issue](./HOW_TO_CREATE_REFACTORING_ISSUE.md)
**Purpose**: Instructions for creating the GitHub issue to track refactoring work.

**Contents**:
- Step-by-step issue creation guide
- Template usage instructions
- Customization tips
- Next steps after issue creation

**Who should read**: Project maintainers and issue creators

---

## 🔗 Related Documentation

### In Repository Root
- **[README.md](../README.md)** - Project overview and setup
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[TESTING.md](../TESTING.md)** - Testing strategy and guide
- **[project-audit.md](../project-audit.md)** - Current architecture issues

### In .github Directory
- **[.github/ISSUE_TEMPLATE/clean-architecture-refactoring.md](../.github/ISSUE_TEMPLATE/clean-architecture-refactoring.md)** - Issue template for refactoring

---

## 🎯 Quick Navigation

### I want to...

**Understand the proposed architecture**  
→ Read [Clean Architecture Implementation Guide](./CLEAN_ARCHITECTURE_GUIDE.md)

**Create a refactoring issue**  
→ Follow [How to Create Refactoring Issue](./HOW_TO_CREATE_REFACTORING_ISSUE.md)

**See current architectural problems**  
→ Review [project-audit.md](../project-audit.md)

**Learn about testing approach**  
→ Read [TESTING.md](../TESTING.md)

**Start contributing**  
→ Read [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## 📖 Reading Order (Recommended)

For developers new to this refactoring effort:

1. **Start**: Read [project-audit.md](../project-audit.md) to understand current issues
2. **Learn**: Read [Clean Architecture Implementation Guide](./CLEAN_ARCHITECTURE_GUIDE.md)
3. **Plan**: Review issue template at `.github/ISSUE_TEMPLATE/clean-architecture-refactoring.md`
4. **Create**: Follow [How to Create Refactoring Issue](./HOW_TO_CREATE_REFACTORING_ISSUE.md)
5. **Implement**: Use the guide to implement each phase
6. **Test**: Follow [TESTING.md](../TESTING.md) for testing approach

---

## 🚀 Implementation Phases

Based on the Clean Architecture guide, implementation follows these phases:

| Phase | Focus | Risk | Estimated Effort |
|-------|-------|------|------------------|
| 1 | Domain Layer | Low | 8-10 hours |
| 2 | Application Layer | Medium | 10-12 hours |
| 3 | Infrastructure Layer | Low | 8-10 hours |
| 4 | Presentation Layer | High | 12-15 hours |
| 5 | Security & Best Practices | Medium | 6-8 hours |
| 6 | Documentation & Testing | Low | 6-8 hours |

**Total**: 40-60 hours (8-12 days part-time)

---

## 🎓 External Resources

### Clean Architecture
- [The Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)

### TypeScript Patterns
- [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Result Type Pattern](https://imhoff.blog/posts/using-results-in-typescript)

### Vue/Nuxt Best Practices
- [Vue.js Enterprise Boilerplate](https://github.com/chrisvfritz/vue-enterprise-boilerplate)
- [Nuxt Layers](https://nuxt.com/docs/guide/going-further/layers)

---

## 📞 Getting Help

If you need assistance:

1. **Architecture Questions**: Review [Clean Architecture Implementation Guide](./CLEAN_ARCHITECTURE_GUIDE.md)
2. **Current Issues**: Check [project-audit.md](../project-audit.md)
3. **Testing**: See [TESTING.md](../TESTING.md)
4. **Contributing**: Read [CONTRIBUTING.md](../CONTRIBUTING.md)
5. **Project-Specific**: Open a discussion in GitHub Issues

---

**Last Updated**: 2026-02-04  
**Maintainer**: @ijklim
