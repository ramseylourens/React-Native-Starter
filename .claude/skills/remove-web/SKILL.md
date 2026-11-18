---
name: remove-web
description: 'Remove Web support by deleting web/ and its root package.json scripts'
user-invocable: true
---

# Remove Web support

When invoked, remove the `web/` directory at the repository root and the Web scripts listed below from the root `package.json`, and ask whether to delete `*.web.ts` files under `src/`. Do not modify other project configuration, platform directories, scripts, or files.

Remove only these keys from the `scripts` section of the root `package.json`:

```json
"web:dev": "webpack serve --config ./web/webpack.config.js",
"web:build": "webpack --config ./web/webpack.config.js",
"web:serve": "serve .dist"
```

1. Confirm the repository root and that `web/` is a direct child of it. If it is missing or is a symlink, stop and report that instead of deleting anything.
2. Find `*.web.ts` files recursively under the repository-root `src/` without following directory symlinks. Show the matching paths and ask whether to delete them. If none are found, report that there are no matching files. Do not delete these files unless the user agrees.
3. Check for uncommitted changes under `web/`, in the root `package.json`, and in any `*.web.ts` files the user agreed to delete. If any exist, stop and ask the user before making changes.
4. Delete the repository-root `web/` directory and its contents, remove only the three listed script keys from the root `package.json`, and delete the matching `*.web.ts` files only if the user agreed.
5. Verify that `web/` no longer exists, that the three script keys are absent, and, if deletion was approved, that the identified `*.web.ts` files are gone. Preserve all other `package.json` content, then report the result.
