# Deployment

ClipPulse is a Next.js app deployed to Vercel. The `dev` branch is the only deployed environment — pushes to `dev` auto-deploy via the Vercel ↔ GitHub integration.

- **GitHub repo:** https://github.com/rzn-lux/ClipPulse
- **Vercel project:** https://vercel.com/danielherdean-7357s-projects/v0-clippulse
- **Deployed branch:** `dev`
- **Package manager:** pnpm

---

## Workflow

```
local dev → commit on a feature branch → merge to dev → push origin/dev → Vercel auto-deploys
```

### 1. Develop locally

```bash
pnpm install
pnpm dev
```

App runs at http://localhost:3000. Local env vars live in `.env.local` (gitignored — never commit it).

### 2. Commit your work

Work on a feature branch off `dev` (don't commit directly to `dev` if you can avoid it):

```bash
git checkout dev
git pull origin dev
git checkout -b feat/<short-name>
# ...make changes...
git add <files>
git commit -m "<message>"
```

### 3. Merge to `dev`

```bash
git checkout dev
git pull origin dev
git merge feat/<short-name>
git push origin dev
```

(Or open a PR into `dev` on GitHub and merge it there.)

### 4. Vercel deploys automatically

As soon as `origin/dev` updates, Vercel builds and deploys. Watch the build at:
https://vercel.com/danielherdean-7357s-projects/v0-clippulse/deployments

A deploy takes a few minutes. If the build fails, the previous deployment stays live.

---

## Environment variables

Any new env var you add to `.env.local` must also be added in Vercel, or the deployed build will break.

1. Open the Vercel project → **Settings** → **Environment Variables**.
2. Add the variable for the appropriate environment(s) (Production / Preview / Development).
3. Redeploy — Vercel does **not** automatically rebuild when env vars change. Trigger a new deployment from the **Deployments** tab (… menu → **Redeploy**) or push a new commit.

Sensitive values (API keys, OAuth secrets, `AUTH_SECRET`, Google API credentials, etc.) should only live in Vercel and `.env.local` — never in the repo.

---

## Verifying a deploy

After Vercel reports success:

1. Open the production URL from the Vercel dashboard.
2. Smoke-test the main flows (auth, any pages that hit external APIs like Google).
3. If something is broken, check **Deployments → [the deploy] → Logs** for build errors, and **Runtime Logs** for server-side errors.

---

## Rolling back

In the Vercel dashboard, go to **Deployments**, find the last known-good deploy, and use the `…` menu → **Promote to Production** (or **Redeploy**). This is faster than reverting in Git.

If you also want the rollback reflected in source control, revert the offending commit on `dev`:

```bash
git checkout dev
git revert <bad-commit-sha>
git push origin dev
```

---

## Troubleshooting

- **Build fails on Vercel but works locally:** usually a missing env var, a case-sensitive import path (macOS is case-insensitive, Vercel's Linux build is not), or a dependency that's in `devDependencies` but needed at build time.
- **`pnpm` lockfile mismatch:** make sure `pnpm-lock.yaml` is committed alongside `package.json` changes.
- **Auth or Google API errors in prod only:** check that `AUTH_SECRET`, OAuth client ID/secret, and any redirect URIs in the Google Cloud console include the Vercel deployment URL.
