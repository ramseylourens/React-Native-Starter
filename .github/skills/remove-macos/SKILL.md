---
name: remove-macos
description: 'Remove macOS support by deleting macos/ and its root package.json scripts'
user-invocable: true
---

# Remove macOS support

When invoked, remove the `macos/` directory at the repository root, remove the two macOS scripts listed below, update or remove `app:dep` as described below in the root `package.json`, and ask whether to delete `*.macos.ts` files under `src/`. Do not modify other project configuration, platform directories, scripts, or files.

Remove only these keys from the `scripts` section of the root `package.json`:

```json
"macos": "react-native run-macos",
"macos:pod:install": "cd macos && pod install"
```

If the repository-root `ios/` directory exists, set the `app:dep` script to `yarn ios:pod:install`. If it does not exist, remove the `app:dep` script.

1. Confirm the repository root and that `macos/` is a direct child of it. If it is missing or is a symlink, stop and report that instead of deleting anything.
2. Find `*.macos.ts` files recursively under the repository-root `src/` without following directory symlinks. Show the matching paths and ask whether to delete them. If none are found, report that there are no matching files. Do not delete these files unless the user agrees.
3. Check for uncommitted changes under `macos/`, in the root `package.json`, and in any `*.macos.ts` files the user agreed to delete. If any exist, stop and ask the user before making changes.
4. Delete the repository-root `macos/` directory and its contents, remove the two listed script keys, update or remove `app:dep` as described above, and delete the matching `*.macos.ts` files only if the user agreed.
5. Verify that `macos/` no longer exists, that the two script keys are absent, that `app:dep` matches the state of `ios/`, and, if deletion was approved, that the identified `*.macos.ts` files are gone. Preserve all other `package.json` content, then report the result.
