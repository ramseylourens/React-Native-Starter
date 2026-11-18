---
name: remove-linux
description: 'Remove Linux support by deleting linux/ and its root package.json scripts'
user-invocable: true
---

# Remove Linux support

When invoked, remove the `linux/` directory at the repository root and the four Linux scripts listed below from the root `package.json`, and ask whether to delete `*.linux.ts` files under `src/`. Do not modify other project configuration, platform directories, scripts, or files.

Remove only these keys from the root `package.json`:

```json
"linux:install": "yarn --cwd linux install --frozen-lockfile",
"linux:dev": "STAGE=production yarn web:build && yarn --cwd linux sync && yarn --cwd linux start",
"linux:build": "STAGE=production yarn web:build && yarn --cwd linux build",
"linux:smoke": "yarn --cwd linux smoke"
```

1. Confirm the repository root and that `linux/` is a direct child of it. If it is missing or is a symlink, stop and report that instead of deleting anything.
2. Find `*.linux.ts` files recursively under the repository-root `src/` without following directory symlinks. Show the matching paths and ask whether to delete them. If none are found, report that there are no matching files. Do not delete these files unless the user agrees.
3. Check for uncommitted changes under `linux/`, in the root `package.json`, and in any `*.linux.ts` files the user agreed to delete. If any exist, stop and ask the user before making changes.
4. Delete the repository-root `linux/` directory and its contents, remove only the four listed script keys from the root `package.json`, and delete the matching `*.linux.ts` files only if the user agreed.
5. Verify that `linux/` no longer exists, that the four script keys are absent, and, if deletion was approved, that the identified `*.linux.ts` files are gone. Preserve all other `package.json` content, then report the result.
