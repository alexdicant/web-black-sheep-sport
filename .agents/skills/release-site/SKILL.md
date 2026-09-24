---
name: release-site
description: Prepare a Black Sheep Sport release, integrate a branch, deploy or publish the static site, close a work branch, or perform pre-release or post-deploy QA. Use for release lifecycle work; follow documented repository and hosting instructions.
---

# Release the site

Read [MEMORY.md](../../../MEMORY.md), [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md), [README.md](../../../README.md), [docs/operations/deployment.md](../../../docs/operations/deployment.md), and `public/.htaccess` before release work. The repository builds a static site into `dist/`; do not assume a provider, credentials, or deploy command that the docs do not establish.

Keep the requested stages distinct. Run pre-release checks for release tasks; perform integration only when explicitly requested; perform post-deploy checks only when there is a real deployed environment to inspect.

## A. Pre-release

1. Inspect `git status --short`, current branch, upstream, and relation to `main` (commits ahead/behind). Review the outgoing commits and diff.
2. Check for accidental temporary files, audit artifacts, secrets, or unrelated changes. Stop and report anything that needs the user's decision; do not silently include or discard it.
3. Run `npm run build` and `git diff --check`. When relevant, inspect `dist/` for expected static routes, event pages, legal pages, and `404.html`.
4. Summarize the branch, included changes, checks, and remaining concerns.

## B. Integration (only on explicit request)

1. Update only the refs needed to integrate the named branch and target; inspect remote/tracking state first.
2. Preserve history. Never force-push or use `git reset --hard`; avoid destructive merge strategies. If conflicts or unexpected divergence require a choice, stop and report it.
3. Verify the merge result and changed files, then run `npm run build` and `git diff --check` again.
4. Do not push unless the user explicitly intends to publish those commits. Do not commit unless explicitly requested.

## C. Deployment (only on explicit request)

Preparing or validating a release does not authorize deployment. Before deploying, identify the target environment and deployment method from repository documentation or details supplied by the user. If the target, method, required credentials, or required approval is unclear or unavailable, stop and ask; do not guess commands or provider.

Deploy only the revision or artifact the user authorized. Do not change hosting configuration, DNS, credentials, or other infrastructure outside the documented procedure unless explicitly requested. Record the deployed revision or artifact and the target environment.

## D. Post-deploy QA (only for an accessible deployed site)

Use the actual deployment URL supplied or documented. Check Home, registered event routes, legal routes, 404, navigation, photo selection, pricing display, WhatsApp action, and basic lightbox behavior as applicable. Check redirects and response headers, including security headers and cache policies for `/_astro/` and `/fonts/`.

Verify `.htaccess` behavior from real server responses; its presence in Git is not proof the server applies it. Report each check as passed, failed, or inaccessible. If production cannot be reached, state exactly what remains unverified. Never perform an automatic rollback.

## E. Branch cleanup (only on explicit request)

Delete a branch only when explicitly requested. Before deletion, confirm its required commits are reachable from the permanent branch. Never delete `main` or the branch currently checked out. Identify whether the requested branch is local or remote; do not assume deleting one also authorizes deleting the other.

Use normal deletion for a branch whose commits are merged. If it has unique commits, do not force-delete: show those commits and ask for explicit confirmation before taking any further deletion action.

## Finish

Show the final `git status --short` and summarize changed files and check results. Do not commit, push, merge, or deploy beyond the action the user explicitly requested.
