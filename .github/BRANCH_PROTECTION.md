# Branch Protection Setup Guide

This guide explains how to set up branch protection rules to enforce testing requirements and code review approval for pull requests.

## Overview

Branch protection rules ensure that:

- All tests must pass before merging
- At least one code review approval is required
- Status checks are displayed on pull requests
- Code quality is maintained

## Prerequisites

You need **admin** access to the repository to configure branch protection rules.

## Setup Instructions

### Step 1: Navigate to Branch Protection Settings

1. Go to your GitHub repository
2. Click on **Settings** (top navigation bar)
3. In the left sidebar, click **Branches**
4. Under "Branch protection rules", click **Add rule** (or edit existing rule for `main`)

### Step 2: Configure Branch Name Pattern

1. In the "Branch name pattern" field, enter: `main`
2. This will apply the protection rules to the main branch

### Step 3: Enable Required Status Checks

Check the following boxes:

- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - Select the following status checks (they will appear after the first PR workflow run):
    - `Run unit tests`
    - `Run E2E tests`
    - `Lint and format check`
    - `Build verification`

### Step 4: Enable Required Reviews

- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: Set to **1** (or more if desired)
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**
  - ⬜ **Require review from Code Owners** (optional - requires CODEOWNERS file)
  - ⬜ **Restrict who can dismiss pull request reviews** (optional)

### Step 5: Additional Protection Settings

Recommended settings:

- ✅ **Require conversation resolution before merging**
  - Ensures all PR comments are addressed before merge

- ✅ **Require linear history** (optional but recommended)
  - Prevents merge commits, keeps git history clean
  - Requires rebase or squash merging

- ✅ **Do not allow bypassing the above settings**
  - Applies rules to administrators as well
  - Recommended for production repositories

- ⬜ **Allow force pushes** - Keep this **unchecked**
  - Force pushes can overwrite history and bypass checks

- ⬜ **Allow deletions** - Keep this **unchecked**
  - Prevents accidental branch deletion

### Step 6: Save Changes

1. Scroll to the bottom of the page
2. Click **Create** (or **Save changes** if editing existing rule)

## Verification

After setting up branch protection:

1. Create a test pull request
2. Verify that the following checks appear:
   - ✅ Run unit tests
   - ✅ Run E2E tests
   - ✅ Lint and format check
   - ✅ Build verification
3. Verify that the "Merge" button is disabled until:
   - All checks pass
   - At least one approval is given
4. Try to merge without approval - should be blocked
5. Try to merge with failing tests - should be blocked

## Example Branch Protection Configuration

```yaml
Branch name pattern: main

Protect matching branches:
  ✅ Require a pull request before merging
    - Required approvals: 1
    ✅ Dismiss stale pull request approvals when new commits are pushed

  ✅ Require status checks to pass before merging
    ✅ Require branches to be up to date before merging
    Status checks:
      - Run unit tests
      - Run E2E tests
      - Lint and format check
      - Build verification

  ✅ Require conversation resolution before merging
  ✅ Require linear history
  ✅ Do not allow bypassing the above settings
  ⬜ Allow force pushes
  ⬜ Allow deletions
```

## Common Issues and Solutions

### Issue: Status checks don't appear in the list

**Solution**: Status checks only appear after they've run at least once. Create a test PR to trigger the workflow, then the checks will be available for selection.

### Issue: "Merge" button is always disabled

**Solution**: Check that:

1. All required status checks have passed
2. Required approvals have been given
3. All conversations are resolved (if enabled)
4. Branch is up to date with base branch (if enabled)

### Issue: Admin can't bypass rules

**Solution**: If "Do not allow bypassing the above settings" is checked, even admins must follow the rules. Uncheck this if admins need bypass capability.

### Issue: Old PRs show outdated status checks

**Solution**: The "Dismiss stale pull request approvals when new commits are pushed" setting handles this. New commits will re-trigger all checks.

## Workflow Integration

The branch protection rules work with the `.github/workflows/pr-tests.yml` workflow:

1. **PR Created/Updated** → Workflow triggered
2. **Tests Run** → Status checks updated
3. **Results Posted** → Visible on PR
4. **All Pass** → Merge button enabled (with approval)
5. **Any Fail** → Merge blocked until fixed

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Status Checks Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [GitHub Required Reviews Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)

## Maintenance

Review and update these settings:

- When adding new CI/CD jobs
- When team size changes (adjust approval count)
- Quarterly security review
- When workflow names change

## Support

If you encounter issues:

1. Check GitHub Actions logs in the "Actions" tab
2. Verify workflow file syntax
3. Ensure all secrets/variables are configured
4. Contact repository maintainer
