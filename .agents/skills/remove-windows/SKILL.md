---
name: remove-windows
description: 'Remove Windows support by deleting windows/ and its root package.json scripts'
user-invocable: true
---

# Remove Windows support

When invoked, remove the `windows/` directory at the repository root and the Windows scripts listed below from the root `package.json`, and ask whether to delete `*.windows.ts` files under `src/`. Do not modify other project configuration, platform directories, scripts, or files.

Remove only these keys from the `scripts` section of the root `package.json`:

```json
"windows": "npx @react-native-community/cli run-windows",
"test:windows": "jest --config jest.config.windows.js"
```

1. Confirm the repository root and that `windows/` is a direct child of it. If it is missing or is a symlink, stop and report that instead of deleting anything.
2. Find `*.windows.ts` files recursively under the repository-root `src/` without following directory symlinks. Show the matching paths and ask whether to delete them. If none are found, report that there are no matching files. Do not delete these files unless the user agrees.
3. Check for uncommitted changes under `windows/`, in the root `package.json`, and in any `*.windows.ts` files the user agreed to delete. If any exist, stop and ask the user before making changes.
4. Delete the repository-root `windows/` directory and its contents, remove only the listed script keys from the root `package.json`, and delete the matching `*.windows.ts` files only if the user agreed.
5. Verify that `windows/` no longer exists, that the listed script keys are absent, and, if deletion was approved, that the identified `*.windows.ts` files are gone. Preserve all other `package.json` content, then report the result.
