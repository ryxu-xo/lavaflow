# GIT.md

Practical Git guide for `lavaflow` (Windows/PowerShell-friendly).

## 0) Prerequisite (Git must be installed)

Check first:

```powershell
git --version
```

If you get `git is not recognized`, install Git for Windows:

- Download: https://git-scm.com/download/win
- Install with default options (includes Git in PATH)
- Close and reopen PowerShell

Then verify again:

```powershell
git --version
```

## 1) First-time setup (only once per machine)

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 2) Start working on this repo

From project root:

```powershell
git status
git checkout -b release/v3.1.0
```

If the branch already exists:

```powershell
git checkout release/v3.1.0
```

## 3) Review changes

```powershell
git status
git diff
```

## 4) Stage files

Stage all:

```powershell
git add .
```

Or stage specific files:

```powershell
git add package.json src/index.ts README.md CHANGELOG.md src/** examples/**
```

## 5) Commit

```powershell
git commit -m "release: v3.1.0 - failover, voice payload fixes, autoplay improvements, docs refresh"
```

## 6) Connect to existing GitHub repo

Since your repo already exists at:

`https://github.com/ryxu-xo/lavaflow`

Check current remotes first:

```powershell
git remote -v
```

If `origin` is missing, add it:

```powershell
git remote add origin https://github.com/ryxu-xo/lavaflow.git
```

If `origin` exists but URL is wrong, update it:

```powershell
git remote set-url origin https://github.com/ryxu-xo/lavaflow.git
```

## 7) Push branch

```powershell
git push -u origin release/v3.1.0
```

If you get:

`error: src refspec release/v3.1.0 does not match any`

Do this first:

```powershell
git checkout -b release/v3.1.0
git add .
git commit -m "release: v3.1.0"
git push -u origin release/v3.1.0
```

Or if you already committed and just want to push current branch name:

```powershell
git push -u origin HEAD
```

## 8) Tag release

Create annotated tag:

```powershell
git tag -a v3.1.0 -m "lavaflow v3.1.0"
```

Push tag:

```powershell
git push origin v3.1.0
```

## 9) Merge to main (after PR approval)

```powershell
git checkout main
git pull origin main
git merge --no-ff release/v3.1.0
git push origin main
```

## 10) Quick rollback helpers

Undo last commit but keep changes staged:

```powershell
git reset --soft HEAD~1
```

Unstage everything:

```powershell
git reset
```

Discard local changes in a file:

```powershell
git checkout -- README.md
```

## Recommended workflow for this repo

1. Update code + docs (`README.md`, `CHANGELOG.md`, version fields)
2. Run build/tests
3. Commit with clear release message
4. Push branch + open PR
5. Tag after merge to `main`

## Useful checks before release

```powershell
npm run build
git status
git log --oneline -n 5
```
