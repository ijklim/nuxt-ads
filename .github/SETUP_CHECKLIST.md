# PR Testing Setup Checklist

This checklist helps you complete the setup of automated testing requirements for pull requests.

## ✅ Automated (Already Done)

The following has been configured automatically in this PR:

- [x] Created `.github/workflows/pr-tests.yml` workflow file
  - Runs unit tests on every PR
  - Runs E2E tests on every PR
  - Verifies build succeeds
  - Checks linting (if configured)
  - Posts coverage reports as comments
  
- [x] Updated documentation
  - `README.md` - Added testing section
  - `TESTING.md` - Added PR workflow documentation
  - `.github/BRANCH_PROTECTION.md` - Created setup guide

## 🔧 Manual Setup Required

The following steps must be completed manually by a repository admin:

### Step 1: Merge This PR

1. Review the changes in this PR
2. Approve the PR
3. Merge to `main` branch

### Step 2: Verify Workflow Runs

After merging:

1. Create a test PR to trigger the new workflow
2. Go to the **Actions** tab in GitHub
3. Verify "Pull Request Tests" workflow runs successfully
4. Check that all 4 jobs complete:
   - Run unit tests
   - Run E2E tests
   - Lint and format check
   - Build verification

### Step 3: Configure Branch Protection Rules

**⚠️ Important:** This can only be done by repository administrators via GitHub UI.

1. Go to **Settings** → **Branches** → **Add rule**
2. Set branch name pattern: `main`
3. Enable the following:

   **Required Status Checks:**
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select these status checks:
     - `Run unit tests`
     - `Run E2E tests`
     - `Lint and format check`
     - `Build verification`

   **Required Reviews:**
   - ✅ Require a pull request before merging
   - ✅ Require approvals: **1** (or more)
   - ✅ Dismiss stale pull request approvals when new commits are pushed

   **Additional Settings:**
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings
   - ⬜ Allow force pushes (keep unchecked)
   - ⬜ Allow deletions (keep unchecked)

4. Click **Create** to save

📖 **Detailed instructions:** See [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md)

### Step 4: Test Branch Protection

1. Create a new test PR
2. Verify that:
   - All workflow checks run automatically
   - Merge button is disabled until checks pass
   - Merge button is disabled until approval is given
   - Approval is dismissed when new commits are pushed
3. Try to merge without approval → Should be blocked
4. Try to merge with failing tests → Should be blocked

### Step 5: Update Team Documentation

1. Notify team members about new PR requirements
2. Share the testing documentation:
   - `README.md` - Testing commands
   - `TESTING.md` - Comprehensive testing guide
3. Ensure all contributors understand:
   - Tests must pass before PR can be merged
   - At least 1 approval is required
   - All conversations must be resolved

## 📊 Expected Workflow

Once setup is complete, the PR workflow will work as follows:

```
Developer creates PR
    ↓
Workflows triggered automatically:
  - Unit tests run
  - E2E tests run
  - Build verification
  - Lint check
    ↓
Status checks posted to PR
    ↓
Developer requests review
    ↓
Reviewer approves PR
    ↓
All checks pass + Approval given
    ↓
Merge button enabled
    ↓
PR merged to main
```

## 🆘 Troubleshooting

### Status checks don't appear in branch protection settings

**Solution:** Status checks only appear after they've run at least once. Create and merge this PR first, then create a test PR to trigger the workflow.

### Workflow doesn't trigger on PR

**Solution:** 
1. Check that workflow file is on the `main` branch
2. Verify workflow file syntax is valid
3. Check Actions tab for error messages

### Tests fail in CI but pass locally

**Solution:**
1. Check Node.js version matches (22)
2. Verify pnpm version matches (10)
3. Review workflow logs in Actions tab
4. Run `pnpm install --no-frozen-lockfile` locally

### E2E tests fail to install browsers

**Solution:** The workflow includes `pnpm exec playwright install --with-deps chromium` which should handle this automatically.

## 📝 Maintenance

Review and update periodically:

- **Monthly:** Review branch protection settings
- **Quarterly:** Update workflow dependencies (actions versions)
- **As needed:** Add new status checks for new workflow jobs
- **As needed:** Adjust approval requirements based on team size

## ✅ Verification Checklist

Use this checklist to verify everything is working:

- [ ] PR workflow file exists in `.github/workflows/pr-tests.yml`
- [ ] Workflow runs on test PR
- [ ] All 4 jobs complete successfully
- [ ] Branch protection rules configured
- [ ] Status checks appear on PR
- [ ] Merge blocked without approval
- [ ] Merge blocked with failing tests
- [ ] Coverage report posted as comment
- [ ] Team notified of new requirements

## 🎉 Success!

Once all items are checked, your PR testing requirements are fully implemented!

Contributors will now benefit from:
- ✅ Automated quality checks
- ✅ Prevented broken code merges
- ✅ Required code reviews
- ✅ Better code quality and reliability
