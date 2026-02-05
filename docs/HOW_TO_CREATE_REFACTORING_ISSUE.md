# How to Create the Clean Architecture Refactoring Issue

This guide explains how to use the issue template to create a GitHub issue for refactoring the codebase.

## 📝 Quick Start

### Option 1: Use GitHub's Issue Template UI (Recommended)

1. Go to the repository on GitHub: https://github.com/ijklim/nuxt-ads
2. Click the **Issues** tab
3. Click **New Issue**
4. Select **Clean/Hexagonal Architecture Refactoring** from the template list
5. The template will auto-populate with all details
6. Review and click **Submit new issue**

### Option 2: Create Manually from Template File

If the template doesn't appear in the UI:

1. Go to the repository on GitHub
2. Click the **Issues** tab
3. Click **New Issue**
4. Copy the content from `.github/ISSUE_TEMPLATE/clean-architecture-refactoring.md`
5. Paste into the issue description
6. Add labels: `enhancement`, `architecture`, `refactoring`, `technical-debt`
7. Set title: **Refactor: Implement Clean/Hexagonal Architecture**
8. Click **Submit new issue**

## 📂 What's Included

This repository now contains:

1. **Issue Template** (`.github/ISSUE_TEMPLATE/clean-architecture-refactoring.md`)
   - Pre-formatted GitHub issue template
   - Comprehensive refactoring plan
   - Phase-by-phase implementation steps
   - Success criteria and acceptance checklist

2. **Architecture Guide** (`docs/CLEAN_ARCHITECTURE_GUIDE.md`)
   - Detailed implementation guide
   - Layer-by-layer breakdown
   - Code examples for each layer
   - Testing strategies
   - Migration path with risk assessment

## 🎯 What the Issue Template Contains

### Sections Included:

1. **Overview** - High-level description and goals
2. **Proposed Architecture** - Four-layer architecture breakdown:
   - Domain Layer (business logic)
   - Application Layer (use cases)
   - Infrastructure Layer (external concerns)
   - Presentation Layer (UI components)
3. **Code Examples** - TypeScript examples for each layer
4. **Refactoring Steps** - Six phases with detailed tasks
5. **Success Criteria** - Measurable outcomes
6. **Anti-Patterns** - What to avoid with examples
7. **References** - Links to Clean Architecture resources
8. **Migration Strategy** - Backward compatibility and rollback plan
9. **Acceptance Checklist** - Pre-merge verification steps

## 🚀 Next Steps After Creating the Issue

1. **Review with Team** - Discuss approach and priorities
2. **Break Down Phases** - Create sub-issues if needed
3. **Start with Phase 1** - Domain layer (lowest risk)
4. **Implement Incrementally** - One phase at a time
5. **Test at Each Step** - Never move to next phase without tests
6. **Update Documentation** - Keep guides in sync with code

## 📋 Customization

You can customize the issue template by editing:

```
.github/ISSUE_TEMPLATE/clean-architecture-refactoring.md
```

Common customizations:
- Adjust estimated effort/timeline
- Add/remove phases based on team capacity
- Modify success criteria
- Add project-specific requirements

## 🔗 Related Files

- **Issue Template**: `.github/ISSUE_TEMPLATE/clean-architecture-refactoring.md`
- **Architecture Guide**: `docs/CLEAN_ARCHITECTURE_GUIDE.md`
- **Project Audit**: `project-audit.md` (existing architectural analysis)
- **Contributing Guide**: `CONTRIBUTING.md`
- **Testing Guide**: `TESTING.md`

## 💡 Tips

1. **Don't Rush** - This is a major refactoring. Take your time.
2. **Get Buy-In** - Ensure all maintainers understand the approach.
3. **Measure Impact** - Track test coverage and complexity metrics.
4. **Be Pragmatic** - Stop at any phase if ROI doesn't justify continuing.
5. **Document Decisions** - Create ADRs (Architecture Decision Records) for major choices.

## ❓ Questions?

If you have questions about:
- **The architecture pattern**: Read `docs/CLEAN_ARCHITECTURE_GUIDE.md`
- **Current issues**: Review `project-audit.md`
- **Implementation details**: Check the issue template examples
- **Testing approach**: See `TESTING.md`

---

**Created**: 2026-02-04  
**Purpose**: Guide for creating Clean Architecture refactoring issue  
**Status**: Ready to use
