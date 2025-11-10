# Branch Protection Configuration

This document describes how to configure branch protection rules in GitHub to enforce testing requirements and code review before merging pull requests.

## Overview

Branch protection rules ensure that:
- All tests pass before code can be merged
- At least one code review approval is obtained
- Code quality standards are maintained

## Automated Testing

The `.github/workflows/pr-tests.yml` workflow automatically:
- ✅ Runs unit tests on every PR commit
- ✅ Runs E2E tests on every PR commit
- ✅ Reports results as status checks
- ✅ Cancels outdated test runs when new commits are pushed

## Manual Configuration Required

GitHub branch protection rules must be configured manually in the repository settings. Follow these steps:

### 1. Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Under "Branch protection rules", click **Add rule**
4. In "Branch name pattern", enter: `main`

### 2. Configure Required Settings

Enable the following options:

#### Require a pull request before merging
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: Set to **1** (at least one approval required)
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**
  - ✅ **Require review from Code Owners** (optional, if you have a CODEOWNERS file)

#### Require status checks to pass before merging
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - Add required status checks:
    - ✅ `Unit Tests` (from pr-tests.yml workflow)
    - ✅ `E2E Tests` (from pr-tests.yml workflow)

#### Additional Recommended Settings
- ✅ **Require conversation resolution before merging**
- ✅ **Do not allow bypassing the above settings**
- ⚠️ **Allow force pushes**: Leave disabled (recommended)
- ⚠️ **Allow deletions**: Leave disabled (recommended)

### 3. Save Changes

Click **Create** or **Save changes** at the bottom of the page.

## Verification

After configuration, test the protection rules:

1. Create a test branch and make a change
2. Open a pull request to `main`
3. Verify that:
   - ✅ Tests run automatically
   - ✅ Status checks appear on the PR
   - ✅ "Merge" button is blocked until tests pass
   - ✅ "Merge" button is blocked until approval is given
   - ✅ After approval and passing tests, merge is allowed

## Status Check Behavior

### Unit Tests
- **Job Name**: `Unit Tests`
- **Runs**: Vitest test suite
- **Duration**: ~30-60 seconds
- **When it fails**: Component or utility function tests failed
- **How to debug**: Check workflow logs for test output

### E2E Tests
- **Job Name**: `E2E Tests`
- **Runs**: Playwright browser tests
- **Duration**: ~2-5 minutes
- **When it fails**: Critical user workflows are broken
- **How to debug**: Download Playwright report artifact from failed workflow

## Workflow Triggers

The PR tests workflow runs when:
- A pull request is **opened**
- New commits are **pushed** to the PR branch
- A pull request is **reopened**

The workflow does NOT run on:
- Draft pull requests (they run like normal PRs)
- Commits directly to `main` (protected by branch rules)
- Pushes to other branches without PRs

## Troubleshooting

### Tests are not running on PRs
- Verify the workflow file exists: `.github/workflows/pr-tests.yml`
- Check that the PR targets the `main` branch
- Ensure GitHub Actions are enabled in repository settings

### Cannot merge even though tests passed
- Check if approval requirement is met (at least 1 approval)
- Verify all required status checks are green
- Ensure branch is up to date with `main`

### Tests pass locally but fail in CI
- Check for environment-specific issues
- Verify all dependencies are correctly specified in `package.json`
- Review workflow logs for specific error messages

### Old test runs are not being cancelled
- Verify `cancel-in-progress: true` is set in the workflow
- Check that the concurrency group is correctly configured

## Modifying Protection Rules

To update branch protection rules:
1. Go to **Settings** → **Branches**
2. Click **Edit** next to the `main` branch rule
3. Make your changes
4. Click **Save changes**

## Disabling Protection Rules

⚠️ **Warning**: Disabling protection rules allows merging code without tests or review, which can lead to broken production deployments.

To temporarily disable (not recommended):
1. Go to **Settings** → **Branches**
2. Click **Edit** next to the `main` branch rule
3. Uncheck the settings you want to disable
4. Click **Save changes**

To permanently delete:
1. Go to **Settings** → **Branches**
2. Click **Delete** next to the `main` branch rule
3. Confirm deletion

## Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Required Status Checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Testing Guide](./TESTING.md)
