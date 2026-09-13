---
name: release
description: Prepare or update a release for this repository, including its version, changelog, branch, commit, validation, and pull request.
---

# Release

1. Review the complete release diff and choose the semantic version.
2. Use `release/x.y.z`; never rename a branch with an open PR, because GitHub
   closes it.
3. Run `pnpm release:prepare x.y.z`, then replace the generated changelog TODO
   with concise entries covering the full diff. Use the existing categories and
   `Upgrade dependencies: package \`version\`, ...` prose.
4. Run `pnpm release:check x.y.z` and `pnpm validate`.
5. Commit release metadata as `chore(release): x.y.z` and open/update a PR with
   that exact title and a complete validation summary.
6. Verify the remote branch, PR, and checks. Do not merge, tag, publish, or
   delete branches without user authorization.

The post-deployment workflow adds the release snapshot URL to the changelog.
